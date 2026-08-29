import type { MetricName, ServiceName } from "@/lib/domain/types";
import { useCommanderStore } from "@/lib/store/use-commander-store";
import { dependencies, deployments, logs, metricHistory, runbooks, traces } from "@/lib/simulation/scenario";
import { toolDefinitionByName } from "./tool-definitions";
import { toolSchemas, type ToolName } from "./tool-schemas";
import { failure, success, type ToolFailure } from "./tool-results";

type UnknownRecord = Record<string, unknown>;
const duration = (started: number) => Math.max(1, Math.round(performance.now() - started));
const inputSummary = (input: UnknownRecord) => Object.entries(input).map(([key, value]) => `${key}=${String(value)}`).join(", ").slice(0, 180);

export async function executeWebMcpTool(name: ToolName, rawInput: unknown) {
  const started = performance.now();
  const parsed = toolSchemas[name].safeParse(rawInput);
  if (!parsed.success) {
    const result = failure("INVALID_INPUT", `Input for ${name} did not match its schema.`, parsed.error.flatten());
    audit(name, rawInput, "FAILED", duration(started), result.error.message);
    return result;
  }
  try {
    const result = runHandler(name, parsed.data as UnknownRecord);
    const failed = !result.ok;
    audit(name, parsed.data, failed ? "FAILED" : name === "request_rollback" ? "AWAITING_APPROVAL" : "SUCCESS", duration(started), failed ? result.error.message : summarize(name, result.data));
    return result;
  } catch (error) {
    const result = failure("TOOL_EXECUTION_FAILED", error instanceof Error ? error.message : "Unknown tool execution failure.");
    audit(name, parsed.data, "FAILED", duration(started), result.error.message);
    return result;
  }
}

function runHandler(name: ToolName, input: UnknownRecord): ReturnType<typeof success> | ToolFailure {
  const state = useCommanderStore.getState();
  switch (name) {
    case "get_active_incident":
      return success({ ...state.incident, currentMetrics: checkoutMetrics(), revenueImpactIsSynthetic: true });
    case "list_services":
      return success({ services: state.services, count: state.services.length });
    case "query_service_metrics": {
      const service = input.service as ServiceName;
      const metric = input.metric as MetricName;
      const selected = state.services.find((item) => item.name === service);
      if (!selected) return failure("UNKNOWN_SERVICE", `Unknown service: ${service}`);
      const points = metricHistory.map((point) => ({ time: point.time, value: metricValue(point, metric, service, selected) }));
      return success({ service, metric, timeRange: input.timeRange, unit: metricUnit(metric), points, deterministic: true });
    }
    case "search_logs": {
      const keyword = String(input.keyword ?? "").toLowerCase();
      const matches = logs.filter((entry) => (!input.service || entry.service === input.service) && (!input.severity || entry.severity === input.severity) && (!keyword || entry.message.toLowerCase().includes(keyword)));
      if (input.service) state.highlightServices([input.service as ServiceName]);
      return success({ matches, count: matches.length });
    }
    case "search_traces": {
      const matches = traces.filter((trace) => (!input.status || trace.status === input.status) && (!input.correlationId || trace.correlationId === input.correlationId) && (!input.service || trace.spans.some((span) => span.service === input.service)));
      const path = matches.flatMap((trace) => trace.spans.map((span) => span.service));
      state.highlightServices([...new Set(path)]);
      return success({ traces: matches, count: matches.length });
    }
    case "get_service_dependencies": {
      const service = input.service as ServiceName;
      const graph = dependencies[service];
      state.highlightServices([service, ...graph.upstream, ...graph.downstream]);
      return success({ service, ...graph });
    }
    case "get_recent_deployments":
      return success({ deployments: deployments.filter((item) => !input.service || item.service === input.service), timeRange: input.timeRange });
    case "compare_deployments": {
      if (input.service !== "checkout-service" || input.fromVersion !== "v2.18.3" || input.toVersion !== "v2.18.4") return failure("DEPLOYMENT_NOT_FOUND", "The requested version pair is not present in this deterministic scenario.");
      state.markInvestigating("v2.18.4 introduced incompatible payment-token issuer validation.");
      return success({ service: "checkout-service", fromVersion: "v2.18.3", toVersion: "v2.18.4", changes: [{ area: "payment token validation", change: "Require the internal issuer allowlist entry before accepting production tokens.", incidentCorrelation: "HIGH" }], likelyRootCause: "Legitimate payments.prod tokens are rejected by the new issuer check." });
    }
    case "search_runbooks": {
      const query = String(input.query).toLowerCase();
      const matches = runbooks.filter((runbook) => `${runbook.title} ${runbook.steps.join(" ")}`.toLowerCase().includes(query.split(" ")[0]));
      return success({ runbooks: matches.length ? matches : runbooks, count: matches.length || runbooks.length });
    }
    case "simulate_rollback":
      if (input.service !== "checkout-service" || input.targetVersion !== "v2.18.3") return failure("UNSUPPORTED_ROLLBACK", "Only checkout-service v2.18.3 is a known safe target in this scenario.");
      return success({ service: "checkout-service", currentVersion: state.services.find((item) => item.name === "checkout-service")?.version, targetVersion: "v2.18.3", stateChanged: false, expectedErrorRate: { from: 18.4, to: 0.7, unit: "percent" }, expectedP95LatencyMs: 630, confidencePercent: 96, risk: "LOW", estimatedRecovery: "less than 90 simulated seconds" });
    case "estimate_customer_impact":
      return success({ incidentId: "INC-2048", affectedCheckoutAttempts: 1280, approximateAffectedUsers: 1094, estimatedFailedOrdersPerMinute: 236, completedOrderReductionPercent: 38, revenueImpactPerMinuteUsd: 21400, disclaimer: "All values are synthetic demo data." });
    case "request_rollback":
      if (input.service !== "checkout-service" || input.targetVersion !== "v2.18.3") return failure("UNSUPPORTED_ROLLBACK", "Only checkout-service v2.18.3 can be requested in this scenario.");
      return success({ status: "AWAITING_HUMAN_APPROVAL", actionId: state.requestRollback(String(input.reason)).id, message: "A visible approval dialog is waiting for a human decision. Do not execute until approved." });
    case "get_action_status": {
      const action = state.pendingAction;
      if (!action || action.id !== input.actionId) return failure("ACTION_NOT_FOUND", `No action exists with ID ${String(input.actionId)}.`);
      return success({ actionId: action.id, status: action.status, service: action.service, targetVersion: action.targetVersion, humanDecisionRequired: action.status === "PENDING" });
    }
    case "execute_approved_action": {
      const outcome = state.executeAction(String(input.actionId));
      if (!outcome.ok) return failure(outcome.code, outcome.code === "ACTION_NOT_APPROVED" ? "A human must approve this action in the visible UI before execution." : "The action cannot be executed.");
      return success({ actionId: input.actionId, status: "EXECUTED", rollback: "checkout-service v2.18.4 → v2.18.3", recovery: "Deterministic recovery sequence started. Monitor metrics before resolving." });
    }
    case "update_incident": {
      const message = String(input.message);
      if (input.action === "add_status_update") { state.addStatusUpdate(message); return success({ incidentId: "INC-2048", action: "add_status_update", status: state.incident.status, message }); }
      const outcome = state.resolveIncident(message);
      if (!outcome.ok) return failure(outcome.code, "The incident cannot be resolved until rollback recovery reaches MONITORING.");
      return success({ incidentId: "INC-2048", action: "resolve_incident", status: "RESOLVED", message });
    }
  }
}

function audit(name: ToolName, input: unknown, status: "SUCCESS" | "FAILED" | "AWAITING_APPROVAL", durationMs: number, resultSummary: string) {
  useCommanderStore.getState().addActivity({ toolName: name, category: toolDefinitionByName[name].category, inputSummary: input && typeof input === "object" ? inputSummary(input as UnknownRecord) : String(input ?? ""), status, durationMs, resultSummary });
}
function summarize(name: ToolName, data: unknown) { const value = data as Record<string, unknown>; if (name === "request_rollback") return "Human approval requested; no rollback executed."; if (name === "execute_approved_action") return "Approved rollback executed; recovery started."; return `Returned ${Object.keys(value).slice(0, 3).join(", ")}.`; }
function checkoutMetrics() { const service = useCommanderStore.getState().services.find((item) => item.name === "checkout-service")!; return { errorRatePercent: service.errorRate, p95LatencyMs: service.p95LatencyMs, version: service.version }; }
function metricValue(point: (typeof metricHistory)[number], metric: MetricName, service: ServiceName, selected: { errorRate: number; p95LatencyMs: number; requestRate: number }) { if (service !== "checkout-service") return metric === "error_rate" ? selected.errorRate : metric === "p95_latency" ? selected.p95LatencyMs : selected.requestRate; return metric === "error_rate" ? point.errorRate : metric === "p95_latency" ? point.latencyMs : metric === "requests_per_minute" ? point.requestsPerMinute : point.ordersPerMinute; }
function metricUnit(metric: MetricName) { return metric === "error_rate" ? "percent" : metric === "p95_latency" ? "milliseconds" : "per_minute"; }
