import { describe, expect, it } from "vitest";
import { applyRecoveryStage, canExecuteAction, canTransitionIncident } from "@/lib/simulation/engine";
import { initialIncident, initialServices, recoverySequence } from "@/lib/simulation/scenario";
import type { PendingAction } from "@/lib/domain/types";

const action = (status: PendingAction["status"]): PendingAction => ({
  id: "ACT-104",
  type: "ROLLBACK",
  service: "checkout-service",
  currentVersion: "v2.18.4",
  targetVersion: "v2.18.3",
  reason: "Enough evidence exists to request this deterministic rollback.",
  status,
  requestedAt: "now",
  decidedAt: null,
  executedAt: null,
});

describe("deterministic incident engine", () => {
  it("starts with the exact Checkout Meltdown scenario", () => {
    expect(initialIncident.id).toBe("INC-2048");
    expect(initialIncident.severity).toBe("SEV-1");
    expect(initialIncident.status).toBe("INCIDENT");
    expect(initialIncident.revenueImpactPerMinute).toBe(21400);
    expect(initialServices.find((service) => service.name === "checkout-service")).toMatchObject({
      version: "v2.18.4",
      health: "DEGRADED",
      errorRate: 18.4,
      p95LatencyMs: 4700,
    });
    expect(initialServices.find((service) => service.name === "payment-service")?.health).toBe("HEALTHY");
  });

  it("allows only adjacent incident lifecycle transitions", () => {
    expect(canTransitionIncident("INCIDENT", "INVESTIGATING")).toBe(true);
    expect(canTransitionIncident("INVESTIGATING", "MITIGATING")).toBe(true);
    expect(canTransitionIncident("MITIGATING", "MONITORING")).toBe(true);
    expect(canTransitionIncident("MONITORING", "RESOLVED")).toBe(true);
    expect(canTransitionIncident("INCIDENT", "RESOLVED")).toBe(false);
    expect(canTransitionIncident("RESOLVED", "INCIDENT")).toBe(false);
  });

  it("applies the deterministic recovery sequence without mutating source services", () => {
    const original = structuredClone(initialServices);
    const recovered = applyRecoveryStage(initialServices, 4);
    expect(initialServices).toEqual(original);
    expect(recoverySequence.map((point) => point.errorRate)).toEqual([18.4, 12.7, 7.1, 2.2, 0.7]);
    expect(recovered.find((service) => service.name === "checkout-service")).toMatchObject({
      health: "HEALTHY",
      errorRate: 0.7,
      p95LatencyMs: 630,
    });
  });

  it("enforces action authorization states", () => {
    expect(canExecuteAction(null)).toEqual({ ok: false, code: "ACTION_NOT_FOUND" });
    expect(canExecuteAction(action("PENDING"))).toEqual({ ok: false, code: "ACTION_NOT_APPROVED" });
    expect(canExecuteAction(action("REJECTED"))).toEqual({ ok: false, code: "ACTION_NOT_APPROVED" });
    expect(canExecuteAction(action("EXECUTED"))).toEqual({ ok: false, code: "ACTION_ALREADY_EXECUTED" });
    expect(canExecuteAction(action("APPROVED"))).toEqual({ ok: true });
  });
});
