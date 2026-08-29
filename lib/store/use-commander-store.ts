"use client";

import { create } from "zustand";
import type { AgentActivity, Incident, PendingAction, Service, ServiceName } from "@/lib/domain/types";
import { applyRecoveryStage, canExecuteAction } from "@/lib/simulation/engine";
import { deployments, initialIncident, initialServices, metricHistory, recoverySequence } from "@/lib/simulation/scenario";

const clone = <T,>(value: T): T => structuredClone(value);
const activityTime = () => new Date().toISOString();

export interface CommanderState {
  incident: Incident;
  services: Service[];
  pendingAction: PendingAction | null;
  activities: AgentActivity[];
  recoveryStage: number;
  highlightedServices: ServiceName[];
  webMcpStatus: "CHECKING" | "CONNECTED" | "UNAVAILABLE" | "ERROR";
  webMcpError: string | null;
  addActivity: (activity: Omit<AgentActivity, "id" | "timestamp">) => void;
  setWebMcpStatus: (status: CommanderState["webMcpStatus"], error?: string) => void;
  markInvestigating: (hypothesis?: string) => void;
  highlightServices: (services: ServiceName[]) => void;
  requestRollback: (reason: string) => PendingAction;
  approveAction: (id: string) => boolean;
  rejectAction: (id: string) => boolean;
  executeAction: (id: string) => { ok: true } | { ok: false; code: string };
  advanceRecovery: (stage: number) => void;
  addStatusUpdate: (message: string) => void;
  resolveIncident: (message: string) => { ok: true } | { ok: false; code: string };
  resetDemo: () => void;
}

function initialState() {
  return { incident: clone(initialIncident), services: clone(initialServices), pendingAction: null, activities: [], recoveryStage: 0, highlightedServices: [] };
}

export const useCommanderStore = create<CommanderState>((set, get) => ({
  ...initialState(),
  webMcpStatus: "CHECKING",
  webMcpError: null,
  addActivity: (activity) => set((state) => ({ activities: [...state.activities, { ...activity, id: `evt-${state.activities.length + 1}`, timestamp: activityTime() }] })),
  setWebMcpStatus: (webMcpStatus, webMcpError = undefined) => set({ webMcpStatus, webMcpError: webMcpError ?? null }),
  markInvestigating: (hypothesis) => set((state) => ({ incident: { ...state.incident, status: state.incident.status === "INCIDENT" ? "INVESTIGATING" : state.incident.status, hypothesis: hypothesis ?? state.incident.hypothesis } })),
  highlightServices: (highlightedServices) => {
    set({ highlightedServices });
    window.setTimeout(() => set({ highlightedServices: [] }), 2400);
  },
  requestRollback: (reason) => {
    const existing = get().pendingAction;
    if (existing && ["PENDING", "APPROVED"].includes(existing.status)) return existing;
    const action: PendingAction = { id: "ACT-104", type: "ROLLBACK", service: "checkout-service", currentVersion: "v2.18.4", targetVersion: "v2.18.3", reason, status: "PENDING", requestedAt: activityTime(), decidedAt: null, executedAt: null };
    set({ pendingAction: action });
    return action;
  },
  approveAction: (id) => {
    const action = get().pendingAction;
    if (!action || action.id !== id || action.status !== "PENDING") return false;
    set({ pendingAction: { ...action, status: "APPROVED", decidedAt: activityTime() } });
    get().addActivity({ toolName: "Human approved rollback", category: "HUMAN", inputSummary: id, status: "APPROVED", durationMs: 0, resultSummary: "Rollback authorized for agent execution." });
    return true;
  },
  rejectAction: (id) => {
    const action = get().pendingAction;
    if (!action || action.id !== id || action.status !== "PENDING") return false;
    set({ pendingAction: { ...action, status: "REJECTED", decidedAt: activityTime() } });
    get().addActivity({ toolName: "Human rejected rollback", category: "HUMAN", inputSummary: id, status: "REJECTED", durationMs: 0, resultSummary: "Rollback rejected; no state changed." });
    return true;
  },
  executeAction: (id) => {
    const action = get().pendingAction;
    if (!action || action.id !== id) return { ok: false, code: "ACTION_NOT_FOUND" };
    const permission = canExecuteAction(action);
    if (!permission.ok) return permission;
    set((state) => ({
      pendingAction: { ...action, status: "EXECUTED", executedAt: activityTime() },
      incident: { ...state.incident, status: "MITIGATING" },
      services: applyRecoveryStage(state.services.map((service) => service.name === "checkout-service" ? { ...service, version: "v2.18.3" } : service), 1),
      recoveryStage: 1,
    }));
    [2, 3, 4].forEach((stage, index) => window.setTimeout(() => get().advanceRecovery(stage), 1800 * (index + 1)));
    return { ok: true };
  },
  advanceRecovery: (stage) => set((state) => ({
    recoveryStage: stage,
    services: applyRecoveryStage(state.services, stage),
    incident: { ...state.incident, status: stage >= recoverySequence.length - 1 ? "MONITORING" : state.incident.status },
  })),
  addStatusUpdate: (message) => set((state) => ({ incident: { ...state.incident, statusUpdates: [...state.incident.statusUpdates, { timestamp: activityTime(), message, kind: "AGENT" }] } })),
  resolveIncident: (message) => {
    const state = get();
    if (state.incident.status !== "MONITORING" || state.recoveryStage < recoverySequence.length - 1) return { ok: false, code: "RECOVERY_NOT_COMPLETE" };
    set({ incident: { ...state.incident, status: "RESOLVED", resolvedAt: activityTime(), statusUpdates: [...state.incident.statusUpdates, { timestamp: activityTime(), message, kind: "AGENT" }] } });
    return { ok: true };
  },
  resetDemo: () => set({ ...initialState() }),
}));

export function getCurrentMetrics(state: Pick<CommanderState, "services" | "recoveryStage">) {
  const checkout = state.services.find((service) => service.name === "checkout-service")!;
  const recovery = state.recoveryStage > 0 ? recoverySequence[state.recoveryStage] : null;
  return { errorRate: checkout.errorRate, latencyMs: checkout.p95LatencyMs, ordersPerMinute: recovery?.ordersPerMinute ?? 491, revenueRisk: Math.round(21400 * Math.max(0, checkout.errorRate - 0.6) / 17.8) };
}

export function getChartData(state: Pick<CommanderState, "recoveryStage">) {
  if (state.recoveryStage === 0) return metricHistory;
  return [...metricHistory, ...recoverySequence.slice(1, state.recoveryStage + 1).map((point, index) => ({ time: `12:${String(4 + index).padStart(2, "0")}`, ...point, requestsPerMinute: 1280, ...(index === 0 ? { event: "ROLLBACK" as const, eventLabel: "ROLLBACK v2.18.3" } : {}) }))];
}

export { deployments };
