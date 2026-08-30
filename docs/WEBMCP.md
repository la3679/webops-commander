# WebMCP Reference

WebOps Commander uses the imperative WebMCP API exposed through `document.modelContext`. This document describes registration, tool contracts, authorization behavior, auditing, and compatibility.

## Registration lifecycle

The command center feature-detects `document.modelContext` and registers each tool when the client application mounts:

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

The `AbortSignal` removes registrations when the command center unmounts. `@mcp-b/webmcp-types` provides compile-time DOM types only; it is not a runtime polyfill.

The application does not invent a navigator API, inject a bridge, scrape the DOM, or present its developer tester as native WebMCP.

## Shared contracts

Zod schemas are the source of truth for runtime input validation and generated JSON Schema. Input objects are strict, so unknown keys and invalid enum values are rejected.

Successful calls use this envelope:

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

Failed calls use this envelope:

```json
{
  "ok": false,
  "error": {
    "code": "STABLE_ERROR_CODE",
    "message": "Actionable explanation",
    "details": {}
  }
}
```

Known services are `storefront-web`, `checkout-service`, `payment-service`, `inventory-service`, `order-service`, and `notification-service`. Supported telemetry ranges are `15m`, `30m`, and `1h`.

## Tool catalog

### Incident and service context

| Tool                       | Input                                 | Output                                                                          | Behavior                                                        | Errors                             |
| -------------------------- | ------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------------------------- |
| `get_active_incident`      | `{}`                                  | Incident status, severity, impact, exposure, hypothesis, and timestamps         | Read-only                                                       | `INVALID_INPUT`                    |
| `list_services`            | `{}`                                  | Six services with health, version, traffic, error rate, and p95 latency         | Read-only                                                       | `INVALID_INPUT`                    |
| `query_service_metrics`    | `{ service, metric, timeRange }`      | Deterministic time series and units                                             | Read-only                                                       | `INVALID_INPUT`, `UNKNOWN_SERVICE` |
| `get_service_dependencies` | `{ service }`                         | Upstream and downstream service graph                                           | Operationally read-only; updates the visible topology selection | `INVALID_INPUT`                    |
| `estimate_customer_impact` | Optional `{ incidentId: "INC-2048" }` | Synthetic attempts, affected customers, failed orders, exposure, and confidence | Read-only                                                       | `INVALID_INPUT`                    |

Supported metrics are `error_rate`, `p95_latency`, `requests_per_minute`, and `orders_per_minute`.

### Investigation

| Tool                     | Input                                                      | Output                                                          | Behavior  | Errors                                  |
| ------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------- | --------- | --------------------------------------- |
| `search_logs`            | Optional `service`, `severity`, `keyword`, and `timeRange` | Matching structured logs and correlation IDs                    | Read-only | `INVALID_INPUT`                         |
| `search_traces`          | Optional `service`, `status`, and `correlationId`          | Trace summaries and ordered spans                               | Read-only | `INVALID_INPUT`                         |
| `get_recent_deployments` | `{ timeRange, service? }`                                  | Matching deployments, versions, timestamps, status, and summary | Read-only | `INVALID_INPUT`                         |
| `compare_deployments`    | `{ service, fromVersion, toVersion }`                      | Relevant configuration and code delta with incident correlation | Read-only | `INVALID_INPUT`, `DEPLOYMENT_NOT_FOUND` |
| `search_runbooks`        | `{ query }` from 2–120 characters                          | Ranked runbooks and ordered response steps                      | Read-only | `INVALID_INPUT`                         |

Trace correlation IDs follow `tr_#####`.

### Simulation and protected actions

| Tool                      | Input                                         | Output                                                                  | Behavior                                      | Errors                                                                                |
| ------------------------- | --------------------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------- |
| `simulate_rollback`       | `{ service, targetVersion }`                  | Predicted recovery, confidence, risk, duration, and affected dependency | Read-only simulation                          | `INVALID_INPUT`, `UNSUPPORTED_ROLLBACK`                                               |
| `request_rollback`        | `{ service, targetVersion, reason }`          | Pending action ID and next-step guidance                                | Creates a request only; never executes        | `INVALID_INPUT`, `UNSUPPORTED_ROLLBACK`, state conflict                               |
| `get_action_status`       | `{ actionId }` matching `ACT-###`             | Action status, target, decision timestamp, and execution timestamp      | Read-only                                     | `INVALID_INPUT`, `ACTION_NOT_FOUND`                                                   |
| `execute_approved_action` | `{ actionId }`                                | Execution acknowledgment, rollback version, and monitoring guidance     | Mutating; requires matching human approval    | `INVALID_INPUT`, `ACTION_NOT_FOUND`, `ACTION_NOT_APPROVED`, `ACTION_ALREADY_EXECUTED` |
| `update_incident`         | `{ incidentId: "INC-2048", action, message }` | Updated lifecycle acknowledgment                                        | Mutating; resolution requires recovered state | `INVALID_INPUT`, `RECOVERY_NOT_COMPLETE`                                              |

The rollback reason must contain 20–500 characters. `update_incident.action` is either `add_status_update` or `resolve_incident`.

Unexpected handler failures return `TOOL_EXECUTION_FAILED`. Read-only definitions carry `readOnlyHint: true`; mutating definitions carry `readOnlyHint: false`. Scenario fixtures are application-authored, so definitions use `untrustedContentHint: false`.

## Human authorization

Rollback follows a two-phase protocol:

1. `simulate_rollback` forecasts impact without mutation.
2. `request_rollback` creates action `ACT-104` in `PENDING`.
3. An accessible operator dialog displays the target, versions, rationale, risk, and expected recovery.
4. Only the dialog's human controls can approve or reject the request.
5. Approval changes the action to `APPROVED` but does not execute it.
6. The agent separately calls `execute_approved_action({ actionId: "ACT-104" })`.
7. The handler checks the exact ID and current authorization immediately before mutation.
8. Recovery advances through deterministic stages; resolution remains blocked until `MONITORING`.

This separation prevents a request operation from combining intent, authorization, and execution in one call.

## Audit behavior

Every invocation appends an entry to the visible activity timeline with:

- tool name;
- category: `READ`, `SIMULATION`, `APPROVAL`, or `ACTION`;
- summarized input;
- success or failure state;
- deterministic duration;
- timestamp;
- result summary.

Human approval and rejection use the `HUMAN` category. Entries originate from actual handler and operator events rather than a prewritten transcript.

## Compatibility and fallback

WebMCP requires a compatible browser implementation and secure context. Localhost qualifies during development.

The interface reports one of three states:

- connected;
- unavailable;
- registration error.

When WebMCP is unavailable, the operator interface remains fully functional. `/commander?debug=webmcp` enables a labeled developer tester that directly exercises the same handlers and guards. It is a diagnostic fallback, not a substitute transport.

## Verification coverage

Automated tests verify:

- all 15 definitions and generated schemas;
- strict input validation and stable errors;
- read-only and mutating annotations;
- handler queries and guarded transitions;
- rejection and premature-execution behavior;
- duplicate execution and premature resolution;
- human approval controls;
- staged recovery and reset cancellation;
- the complete browser workflow from request through resolution.
