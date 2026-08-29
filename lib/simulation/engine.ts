import type { IncidentStatus, PendingAction, Service } from "@/lib/domain/types";
import { recoverySequence } from "@/lib/simulation/scenario";

const incidentTransitions: Record<IncidentStatus, IncidentStatus[]> = {
  INCIDENT: ["INVESTIGATING"],
  INVESTIGATING: ["MITIGATING"],
  MITIGATING: ["MONITORING"],
  MONITORING: ["RESOLVED"],
  RESOLVED: [],
};

export function canTransitionIncident(from: IncidentStatus, to: IncidentStatus) {
  return from === to || incidentTransitions[from].includes(to);
}

export function applyRecoveryStage(services: Service[], stage: number): Service[] {
  const point = recoverySequence[Math.min(Math.max(stage, 0), recoverySequence.length - 1)];
  return services.map((service) =>
    service.name === "checkout-service"
      ? {
          ...service,
          health: stage >= recoverySequence.length - 1 ? "HEALTHY" : "RECOVERING",
          errorRate: point.errorRate,
          p95LatencyMs: point.latencyMs,
        }
      : service,
  );
}

export function canExecuteAction(action: PendingAction | null) {
  if (!action) return { ok: false as const, code: "ACTION_NOT_FOUND" };
  if (action.status === "EXECUTED") return { ok: false as const, code: "ACTION_ALREADY_EXECUTED" };
  if (action.status !== "APPROVED") return { ok: false as const, code: "ACTION_NOT_APPROVED" };
  return { ok: true as const };
}
