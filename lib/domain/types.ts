export const serviceNames = [
  "storefront-web",
  "checkout-service",
  "payment-service",
  "inventory-service",
  "order-service",
  "notification-service",
] as const;

export type ServiceName = (typeof serviceNames)[number];
export type ServiceHealth = "HEALTHY" | "DEGRADED" | "RECOVERING";
export type IncidentStatus = "INCIDENT" | "INVESTIGATING" | "MITIGATING" | "MONITORING" | "RESOLVED";
export type ActionStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXECUTED" | "FAILED";
export type MetricName = "error_rate" | "p95_latency" | "requests_per_minute" | "orders_per_minute";
export type TimeRange = "15m" | "30m" | "1h";
export type ActivityCategory = "READ" | "SIMULATION" | "APPROVAL" | "ACTION" | "HUMAN";
export type ActivityStatus = "SUCCESS" | "FAILED" | "AWAITING_APPROVAL" | "APPROVED" | "REJECTED";

export interface Incident {
  id: "INC-2048";
  title: string;
  severity: "SEV-1";
  status: IncidentStatus;
  startedAt: string;
  affectedCapability: string;
  estimatedCustomerImpact: string;
  revenueImpactPerMinute: number;
  hypothesis: string | null;
  statusUpdates: StatusUpdate[];
  resolvedAt: string | null;
}

export interface Service {
  name: ServiceName;
  health: ServiceHealth;
  version: string;
  requestRate: number;
  errorRate: number;
  p95LatencyMs: number;
}

export interface MetricPoint {
  time: string;
  errorRate: number;
  latencyMs: number;
  requestsPerMinute: number;
  ordersPerMinute: number;
  event?: "DEPLOY" | "ROLLBACK";
  eventLabel?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  service: ServiceName;
  severity: "INFO" | "WARN" | "ERROR";
  message: string;
  correlationId: string;
}

export interface TraceSpan {
  service: ServiceName;
  operation: string;
  durationMs: number;
  status: "OK" | "ERROR";
  detail?: string;
}

export interface Trace {
  id: string;
  correlationId: string;
  timestamp: string;
  status: "OK" | "ERROR";
  durationMs: number;
  spans: TraceSpan[];
}

export interface Deployment {
  id: string;
  service: ServiceName;
  fromVersion: string;
  toVersion: string;
  deployedAt: string;
  status: "SUCCEEDED" | "ROLLED_BACK";
  summary: string;
}

export interface Runbook {
  id: string;
  title: string;
  steps: string[];
}

export interface AgentActivity {
  id: string;
  timestamp: string;
  toolName: string;
  category: ActivityCategory;
  inputSummary: string;
  status: ActivityStatus;
  durationMs: number;
  resultSummary: string;
}

export interface PendingAction {
  id: string;
  type: "ROLLBACK";
  service: ServiceName;
  currentVersion: string;
  targetVersion: string;
  reason: string;
  status: ActionStatus;
  requestedAt: string;
  decidedAt: string | null;
  executedAt: string | null;
}

export interface StatusUpdate {
  timestamp: string;
  message: string;
  kind: "AGENT" | "SYSTEM";
}
