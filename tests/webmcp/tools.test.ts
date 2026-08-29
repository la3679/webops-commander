import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCommanderStore } from "@/lib/store/use-commander-store";
import { executeWebMcpTool } from "@/lib/webmcp/tool-handlers";
import { toolDefinitions } from "@/lib/webmcp/tool-definitions";

function dataOf<T>(result: Awaited<ReturnType<typeof executeWebMcpTool>>): T {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error.message);
  return result.data as T;
}

describe("WebMCP contracts and handlers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useCommanderStore.getState().resetDemo();
  });

  it("publishes exactly 15 narrow, uniquely named tools", () => {
    expect(toolDefinitions).toHaveLength(15);
    expect(new Set(toolDefinitions.map((tool) => tool.name)).size).toBe(15);
    expect(toolDefinitions.every((tool) => tool.description.length > 30)).toBe(true);
    expect(toolDefinitions.every((tool) => tool.inputSchema.type === "object")).toBe(true);
  });

  it("marks investigative and simulation capabilities read-only", () => {
    expect(toolDefinitions.find((tool) => tool.name === "get_active_incident")?.readOnly).toBe(true);
    expect(toolDefinitions.find((tool) => tool.name === "simulate_rollback")?.readOnly).toBe(true);
    expect(toolDefinitions.find((tool) => tool.name === "request_rollback")?.readOnly).toBe(false);
    expect(toolDefinitions.find((tool) => tool.name === "execute_approved_action")?.readOnly).toBe(false);
  });

  it("rejects malformed inputs with a structured validation error", async () => {
    const result = await executeWebMcpTool("query_service_metrics", {
      service: "made-up",
      metric: "cpu",
      timeRange: "forever",
    });
    expect(result).toMatchObject({ ok: false, error: { code: "INVALID_INPUT" } });
    expect(useCommanderStore.getState().activities.at(-1)?.status).toBe("FAILED");
  });

  it("returns the active incident and six service health records", async () => {
    const incident = await executeWebMcpTool("get_active_incident", {});
    const services = await executeWebMcpTool("list_services", {});
    expect(incident).toMatchObject({
      ok: true,
      data: { id: "INC-2048", severity: "SEV-1", currentMetrics: { errorRatePercent: 18.4 } },
    });
    expect(services).toMatchObject({ ok: true, data: { count: 6 } });
  });

  it("returns deterministic telemetry with deployment-correlated evidence", async () => {
    const metrics = await executeWebMcpTool("query_service_metrics", {
      service: "checkout-service",
      metric: "error_rate",
      timeRange: "30m",
    });
    const entries = await executeWebMcpTool("search_logs", {
      service: "checkout-service",
      severity: "ERROR",
      keyword: "issuer",
    });
    const traceResult = await executeWebMcpTool("search_traces", { service: "checkout-service", status: "ERROR" });
    const metricData = dataOf<{ points: { time: string; value: number }[] }>(metrics);
    const logData = dataOf<{ count: number; matches: { message: string }[] }>(entries);
    const traceData = dataOf<{ traces: { spans: { operation: string; status: string }[] }[] }>(traceResult);
    expect(metricData.points[0]).toEqual({ time: "11:50", value: 0.5 });
    expect(metricData.points.at(-1)).toEqual({ time: "12:03", value: 18.4 });
    expect(logData.count).toBe(2);
    expect(logData.matches[0].message).toContain("v2.18.4");
    expect(
      traceData.traces[0].spans.some((span) => span.operation === "validatePaymentToken" && span.status === "ERROR"),
    ).toBe(true);
  });

  it("returns dependencies, deployments, version comparison, and runbook", async () => {
    const graph = await executeWebMcpTool("get_service_dependencies", { service: "checkout-service" });
    const recent = await executeWebMcpTool("get_recent_deployments", { service: "checkout-service", timeRange: "1h" });
    const comparison = await executeWebMcpTool("compare_deployments", {
      service: "checkout-service",
      fromVersion: "v2.18.3",
      toVersion: "v2.18.4",
    });
    const runbook = await executeWebMcpTool("search_runbooks", { query: "checkout failures" });
    expect(graph).toMatchObject({
      ok: true,
      data: { upstream: ["storefront-web"], downstream: ["payment-service", "inventory-service", "order-service"] },
    });
    expect(recent).toMatchObject({ ok: true, data: { deployments: [{ toVersion: "v2.18.4" }] } });
    expect(dataOf<{ likelyRootCause: string }>(comparison).likelyRootCause).toContain("payments.prod");
    expect(dataOf<{ runbooks: { steps: string[] }[] }>(runbook).runbooks[0].steps).toHaveLength(6);
  });

  it("simulates rollback without mutating state and estimates synthetic impact", async () => {
    const before = structuredClone(useCommanderStore.getState().services);
    const simulation = await executeWebMcpTool("simulate_rollback", {
      service: "checkout-service",
      targetVersion: "v2.18.3",
    });
    const impact = await executeWebMcpTool("estimate_customer_impact", { incidentId: "INC-2048" });
    expect(useCommanderStore.getState().services).toEqual(before);
    expect(simulation).toMatchObject({
      ok: true,
      data: { stateChanged: false, confidencePercent: 96, risk: "LOW", expectedErrorRate: { to: 0.7 } },
    });
    expect(impact).toMatchObject({
      ok: true,
      data: { estimatedFailedOrdersPerMinute: 236, revenueImpactPerMinuteUsd: 21400 },
    });
    expect(dataOf<{ disclaimer: string }>(impact).disclaimer).toContain("synthetic");
  });

  it("requires a separate human decision before execution", async () => {
    const requested = await executeWebMcpTool("request_rollback", {
      service: "checkout-service",
      targetVersion: "v2.18.3",
      reason: "Version and trace evidence identify the issuer validation regression.",
    });
    const blocked = await executeWebMcpTool("execute_approved_action", { actionId: "ACT-104" });
    expect(requested).toMatchObject({ ok: true, data: { status: "AWAITING_HUMAN_APPROVAL", actionId: "ACT-104" } });
    expect(blocked).toMatchObject({ ok: false, error: { code: "ACTION_NOT_APPROVED" } });
    useCommanderStore.getState().approveAction("ACT-104");
    const approved = await executeWebMcpTool("get_action_status", { actionId: "ACT-104" });
    const executed = await executeWebMcpTool("execute_approved_action", { actionId: "ACT-104" });
    expect(approved).toMatchObject({ ok: true, data: { status: "APPROVED" } });
    expect(executed).toMatchObject({ ok: true, data: { status: "EXECUTED" } });
    expect(await executeWebMcpTool("execute_approved_action", { actionId: "ACT-104" })).toMatchObject({
      ok: false,
      error: { code: "ACTION_ALREADY_EXECUTED" },
    });
  });

  it("blocks early resolution and resolves after deterministic recovery", async () => {
    const early = await executeWebMcpTool("update_incident", {
      incidentId: "INC-2048",
      action: "resolve_incident",
      message: "Trying to resolve too soon.",
    });
    expect(early).toMatchObject({ ok: false, error: { code: "RECOVERY_NOT_COMPLETE" } });
    useCommanderStore
      .getState()
      .requestRollback("Version and trace evidence identify the issuer validation regression.");
    useCommanderStore.getState().approveAction("ACT-104");
    useCommanderStore.getState().executeAction("ACT-104");
    vi.runAllTimers();
    const resolved = await executeWebMcpTool("update_incident", {
      incidentId: "INC-2048",
      action: "resolve_incident",
      message: "Checkout recovered after the approved rollback.",
    });
    expect(resolved).toMatchObject({ ok: true, data: { status: "RESOLVED" } });
  });
});
