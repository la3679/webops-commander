# WebMCP Implementation

## What is real

WebOps Commander uses the current imperative WebMCP API exposed at `document.modelContext`. On mount, a client hook feature-detects that object and registers 15 tools with:

```ts
await document.modelContext.registerTool(
  {
    name,
    title,
    description,
    inputSchema,
    annotations: { readOnlyHint, untrustedContentHint: false },
    execute: (input) => executeWebMcpTool(name, input),
  },
  { signal: controller.signal },
);
```

The AbortSignal removes registrations when the command center unmounts. `@mcp-b/webmcp-types` supplies compile-time DOM types; it is not a runtime polyfill. The app does not invent `navigator` APIs, inject a fake bridge, or replace WebMCP with DOM scraping.

When `document.modelContext` is unavailable, the header says WebMCP is unavailable and the dashboard remains useful. The optional `?debug=webmcp` panel invokes the same handlers directly and is visibly labeled as a developer tester, not native transport.

## Shared contract

Zod is the source of truth for input validation and is converted to JSON Schema for registration. All objects are strict. Known services are `storefront-web`, `checkout-service`, `payment-service`, `inventory-service`, `order-service`, and `notification-service`. Supported ranges are `15m`, `30m`, and `1h`.

Successful calls return:

```json
{
  "ok": true,
  "data": {},
  "meta": {
    "synthetic": true,
    "source": "WebOps Commander deterministic simulator"
  }
}
```

Failures return `{ "ok": false, "error": { "code", "message", "details?" } }`. Every call is summarized in the visible audit timeline.

## Registered tools

### Incident and service context

| Tool                       | Input                                                                                                                  | Output                                                                               | Mutates / approval                         | Specific errors                    |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------ | ---------------------------------- |
| `get_active_incident`      | `{}`                                                                                                                   | Incident ID, severity, status, impact, exposure, hypothesis, timestamps              | No; `readOnlyHint: true`                   | `INVALID_INPUT`                    |
| `list_services`            | `{}`                                                                                                                   | Six services with health, version, traffic, error rate, and p95 latency              | No; read-only                              | `INVALID_INPUT`                    |
| `query_service_metrics`    | `{ service, metric, timeRange }`; metric is `error_rate`, `p95_latency`, `requests_per_minute`, or `orders_per_minute` | Deterministic timestamp/value series and units                                       | No; read-only                              | `INVALID_INPUT`, `UNKNOWN_SERVICE` |
| `get_service_dependencies` | `{ service }`                                                                                                          | Upstream/downstream graph for the service; also highlights the visible topology path | UI selection only; read-only operationally | `INVALID_INPUT`                    |
| `estimate_customer_impact` | optional `{ incidentId: "INC-2048" }`                                                                                  | Synthetic attempts, affected customers, failed orders, revenue exposure, confidence  | No; read-only                              | `INVALID_INPUT`                    |

### Investigation evidence

| Tool                     | Input                                                      | Output                                                       | Mutates / approval | Specific errors                         |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------ | ------------------ | --------------------------------------- |
| `search_logs`            | optional `service`, `severity`, `keyword`, `timeRange`     | Matching structured logs with timestamps and correlation IDs | No; read-only      | `INVALID_INPUT`                         |
| `search_traces`          | optional `service`, `status`, `correlationId` (`tr_#####`) | Trace summaries and ordered spans with duration/status       | No; read-only      | `INVALID_INPUT`                         |
| `get_recent_deployments` | `{ timeRange, service? }`                                  | Matching deployments, versions, timestamps, status, summary  | No; read-only      | `INVALID_INPUT`                         |
| `compare_deployments`    | `{ service, fromVersion, toVersion }`                      | The relevant config/code delta and incident correlation      | No; read-only      | `INVALID_INPUT`, `DEPLOYMENT_NOT_FOUND` |
| `search_runbooks`        | `{ query }` (2–120 chars)                                  | Ranked matching runbooks and ordered response steps          | No; read-only      | `INVALID_INPUT`                         |

### Simulation and protected action

| Tool                      | Input                                                                                              | Output                                                                            | Mutates / approval                                                    | Specific errors                                                                       |
| ------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `simulate_rollback`       | `{ service, targetVersion }`                                                                       | Predicted error/latency recovery, confidence, risk, duration, affected dependency | No; read-only simulation                                              | `INVALID_INPUT`, `UNSUPPORTED_ROLLBACK`                                               |
| `request_rollback`        | `{ service, targetVersion, reason }` (reason 20–500 chars)                                         | `ACT-104`, `AWAITING_HUMAN_APPROVAL`, and explicit next-step guidance             | Creates pending request only; human decision required; never executes | `INVALID_INPUT`, `UNSUPPORTED_ROLLBACK`, state conflict through execution wrapper     |
| `get_action_status`       | `{ actionId }` (`ACT-###`)                                                                         | Action status, target, decision/execution timestamps                              | No; read-only                                                         | `INVALID_INPUT`, `ACTION_NOT_FOUND`                                                   |
| `execute_approved_action` | `{ actionId }`                                                                                     | Execution acknowledgement, rollback version, monitoring guidance                  | Yes; only after matching UI approval                                  | `INVALID_INPUT`, `ACTION_NOT_FOUND`, `ACTION_NOT_APPROVED`, `ACTION_ALREADY_EXECUTED` |
| `update_incident`         | `{ incidentId: "INC-2048", action, message }`; action is `add_status_update` or `resolve_incident` | Updated lifecycle/status acknowledgement                                          | Yes; status update is immediate; resolution requires recovered state  | `INVALID_INPUT`, `RECOVERY_INCOMPLETE`                                                |

All tools may also return `TOOL_EXECUTION_FAILED` for an unexpected handler exception. Mutating tools have `readOnlyHint: false`; all others have `readOnlyHint: true`. The fixtures are application-authored, so registrations set `untrustedContentHint: false`.

## Human authorization, step by step

1. An agent calls `simulate_rollback`. No operational state changes.
2. It calls `request_rollback` with the exact service, target, and rationale.
3. The store creates `ACT-104` in `PENDING`; an accessible modal presents scope, risk, and predicted recovery.
4. Only the human's **Approve rollback** or **Reject request** control can make the decision.
5. Approval changes the action to `APPROVED` but does not execute it.
6. The agent separately calls `execute_approved_action({ actionId: "ACT-104" })`.
7. The handler validates the action ID and current status immediately before applying the rollback.
8. Recovery advances through fixed stages. Resolution stays blocked until `MONITORING`.

This separation allows a human to understand intent before authorizing it, preserves an audit event for the decision, and prevents a request tool from smuggling execution into the same call.

## Audit behavior

Each invocation records tool name, category (`READ`, `SIMULATION`, `APPROVAL`, or `ACTION`), summarized input, result status, deterministic duration, timestamp, and result summary. Human approval/rejection is recorded as `HUMAN`. The activity rail is not a fabricated chat transcript; entries originate from actual handler or operator events.

## Browser verification performed

Native registration was exercised in a WebMCP-enabled browser. The browser discovered all 15 names with their generated schemas and annotations. Calls were made through the browser tool channel to:

- inspect the incident, metrics, logs, traces, deployments, and versions;
- simulate rollback and request approval;
- verify premature execution returns `ACTION_NOT_APPROVED`;
- verify rejection produces `REJECTED` state;
- reset, request again, approve in the human UI, then execute separately;
- observe version `v2.18.3`, deterministic recovery to 0.7% / 630 ms, and resolve;
- verify the resulting audit rail and resolved screen.

Automated tests additionally cover every definition/schema, core handlers, invalid inputs, protected execution, duplicate execution, premature resolution, approval controls, and the complete browser path.

## Compatibility

WebMCP is an emerging browser feature and requires a compatible implementation plus a secure context (localhost qualifies for local development). The product never claims support where the API is absent. Feature detection has three visible states: connected, unavailable, or registration error. No credentials, extension, or environment variables are required by this repository.
