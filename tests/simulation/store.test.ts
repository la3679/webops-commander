import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentMetrics, useCommanderStore } from "@/lib/store/use-commander-store";

describe("commander state machine", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useCommanderStore.getState().resetDemo();
  });

  it("creates a pending rollback and moves the incident into investigation", () => {
    const result = useCommanderStore
      .getState()
      .requestRollback("The release and trace evidence identify issuer validation as the cause.");
    const state = useCommanderStore.getState();
    expect(result.id).toBe("ACT-104");
    expect(state.pendingAction?.status).toBe("PENDING");
    expect(state.incident.status).toBe("INVESTIGATING");
    expect(state.incident.hypothesis).toContain("v2.18.4");
  });

  it("cannot execute before approval or after rejection", () => {
    const state = useCommanderStore.getState();
    state.requestRollback("The release and trace evidence identify issuer validation as the cause.");
    expect(useCommanderStore.getState().executeAction("ACT-104")).toEqual({ ok: false, code: "ACTION_NOT_APPROVED" });
    expect(useCommanderStore.getState().rejectAction("ACT-104")).toBe(true);
    expect(useCommanderStore.getState().executeAction("ACT-104")).toEqual({ ok: false, code: "ACTION_NOT_APPROVED" });
  });

  it("executes once after approval and reaches monitoring deterministically", () => {
    const state = useCommanderStore.getState();
    state.requestRollback("The release and trace evidence identify issuer validation as the cause.");
    expect(useCommanderStore.getState().approveAction("ACT-104")).toBe(true);
    expect(useCommanderStore.getState().executeAction("ACT-104")).toEqual({ ok: true });
    expect(useCommanderStore.getState().pendingAction?.status).toBe("EXECUTED");
    expect(useCommanderStore.getState().services.find((service) => service.name === "checkout-service")?.version).toBe(
      "v2.18.3",
    );
    expect(useCommanderStore.getState().executeAction("ACT-104")).toEqual({
      ok: false,
      code: "ACTION_ALREADY_EXECUTED",
    });
    vi.runAllTimers();
    expect(useCommanderStore.getState().incident.status).toBe("MONITORING");
    expect(getCurrentMetrics(useCommanderStore.getState())).toMatchObject({
      errorRate: 0.7,
      latencyMs: 630,
      ordersPerMinute: 794,
    });
  });

  it("rejects early resolution and permits it after recovery", () => {
    expect(useCommanderStore.getState().resolveIncident("Recovered.")).toEqual({
      ok: false,
      code: "RECOVERY_NOT_COMPLETE",
    });
    const state = useCommanderStore.getState();
    state.requestRollback("The release and trace evidence identify issuer validation as the cause.");
    useCommanderStore.getState().approveAction("ACT-104");
    useCommanderStore.getState().executeAction("ACT-104");
    vi.runAllTimers();
    expect(useCommanderStore.getState().resolveIncident("Checkout recovered after rollback.")).toEqual({ ok: true });
    expect(useCommanderStore.getState().incident.status).toBe("RESOLVED");
  });

  it("restores the exact initial incident on reset", () => {
    useCommanderStore
      .getState()
      .requestRollback("The release and trace evidence identify issuer validation as the cause.");
    useCommanderStore.getState().approveAction("ACT-104");
    useCommanderStore.getState().resetDemo();
    const state = useCommanderStore.getState();
    expect(state.incident.status).toBe("INCIDENT");
    expect(state.pendingAction).toBeNull();
    expect(state.activities).toEqual([]);
    expect(state.recoveryStage).toBe(0);
    expect(state.services.find((service) => service.name === "checkout-service")).toMatchObject({
      version: "v2.18.4",
      errorRate: 18.4,
    });
  });

  it("cancels pending recovery timers when reset is pressed mid-rollback", () => {
    const state = useCommanderStore.getState();
    const previousResetRevision = state.resetRevision;
    state.requestRollback("The release and trace evidence identify issuer validation as the cause.");
    useCommanderStore.getState().approveAction("ACT-104");
    useCommanderStore.getState().executeAction("ACT-104");
    expect(useCommanderStore.getState().recoveryStage).toBe(1);

    useCommanderStore.getState().resetDemo();
    vi.runAllTimers();

    expect(useCommanderStore.getState()).toMatchObject({
      recoveryStage: 0,
      pendingAction: null,
      resetRevision: previousResetRevision + 1,
    });
    expect(useCommanderStore.getState().services.find((service) => service.name === "checkout-service")).toMatchObject({
      version: "v2.18.4",
      errorRate: 18.4,
    });
  });
});
