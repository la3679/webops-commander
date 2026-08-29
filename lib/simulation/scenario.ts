import type { Deployment, Incident, LogEntry, MetricPoint, Runbook, Service, Trace } from "@/lib/domain/types";

export const incidentStart = "2026-08-29T12:01:18.000Z";

export const initialIncident: Incident = {
  id: "INC-2048",
  title: "Checkout failures after checkout-service deployment",
  severity: "SEV-1",
  status: "INCIDENT",
  startedAt: incidentStart,
  affectedCapability: "Customer checkout",
  estimatedCustomerImpact: "38% reduction in completed orders",
  revenueImpactPerMinute: 21400,
  hypothesis: null,
  statusUpdates: [],
  resolvedAt: null,
};

export const initialServices: Service[] = [
  {
    name: "storefront-web",
    health: "HEALTHY",
    version: "v5.42.1",
    requestRate: 3840,
    errorRate: 0.4,
    p95LatencyMs: 280,
  },
  {
    name: "checkout-service",
    health: "DEGRADED",
    version: "v2.18.4",
    requestRate: 1280,
    errorRate: 18.4,
    p95LatencyMs: 4700,
  },
  {
    name: "payment-service",
    health: "HEALTHY",
    version: "v4.9.2",
    requestRate: 1042,
    errorRate: 0.3,
    p95LatencyMs: 410,
  },
  {
    name: "inventory-service",
    health: "HEALTHY",
    version: "v3.11.7",
    requestRate: 980,
    errorRate: 0.2,
    p95LatencyMs: 220,
  },
  { name: "order-service", health: "HEALTHY", version: "v6.3.0", requestRate: 801, errorRate: 0.2, p95LatencyMs: 340 },
  {
    name: "notification-service",
    health: "HEALTHY",
    version: "v1.24.5",
    requestRate: 762,
    errorRate: 0.1,
    p95LatencyMs: 180,
  },
];

export const metricHistory: MetricPoint[] = [
  { time: "11:50", errorRate: 0.5, latencyMs: 590, requestsPerMinute: 1235, ordersPerMinute: 792 },
  { time: "11:53", errorRate: 0.6, latencyMs: 610, requestsPerMinute: 1251, ordersPerMinute: 801 },
  { time: "11:56", errorRate: 0.6, latencyMs: 620, requestsPerMinute: 1268, ordersPerMinute: 796 },
  { time: "11:59", errorRate: 0.7, latencyMs: 640, requestsPerMinute: 1274, ordersPerMinute: 788 },
  {
    time: "12:00",
    errorRate: 0.8,
    latencyMs: 680,
    requestsPerMinute: 1290,
    ordersPerMinute: 781,
    event: "DEPLOY",
    eventLabel: "DEPLOY v2.18.4",
  },
  { time: "12:01", errorRate: 8.9, latencyMs: 2100, requestsPerMinute: 1288, ordersPerMinute: 674 },
  { time: "12:02", errorRate: 15.2, latencyMs: 3900, requestsPerMinute: 1281, ordersPerMinute: 532 },
  { time: "12:03", errorRate: 18.4, latencyMs: 4700, requestsPerMinute: 1280, ordersPerMinute: 491 },
];

export const recoverySequence = [
  { errorRate: 18.4, latencyMs: 4700, ordersPerMinute: 491 },
  { errorRate: 12.7, latencyMs: 3100, ordersPerMinute: 558 },
  { errorRate: 7.1, latencyMs: 1800, ordersPerMinute: 643 },
  { errorRate: 2.2, latencyMs: 890, ordersPerMinute: 742 },
  { errorRate: 0.7, latencyMs: 630, ordersPerMinute: 794 },
] as const;

export const logs: LogEntry[] = [
  {
    id: "log-1",
    timestamp: "12:01:42.118",
    service: "checkout-service",
    severity: "ERROR",
    message:
      "TokenValidationError: issuer mismatch during payment token validation version=v2.18.4 issuer=payments.prod",
    correlationId: "tr_84291",
  },
  {
    id: "log-2",
    timestamp: "12:01:42.121",
    service: "checkout-service",
    severity: "WARN",
    message: "Checkout request rejected order=ord_29184 reason=invalid_token_issuer",
    correlationId: "tr_84291",
  },
  {
    id: "log-3",
    timestamp: "12:01:43.002",
    service: "payment-service",
    severity: "INFO",
    message: "Payment authorization completed upstream_status=healthy",
    correlationId: "tr_84292",
  },
  {
    id: "log-4",
    timestamp: "12:02:06.841",
    service: "checkout-service",
    severity: "ERROR",
    message: "TokenValidationError: expected issuer payments.internal received payments.prod",
    correlationId: "tr_84308",
  },
  {
    id: "log-5",
    timestamp: "12:02:08.108",
    service: "inventory-service",
    severity: "INFO",
    message: "Reservation capacity within normal range utilization=61%",
    correlationId: "tr_84311",
  },
];

export const traces: Trace[] = [
  {
    id: "trace-1",
    correlationId: "tr_84291",
    timestamp: "12:01:42.106",
    status: "ERROR",
    durationMs: 4681,
    spans: [
      { service: "storefront-web", operation: "POST /checkout", durationMs: 4681, status: "ERROR" },
      { service: "checkout-service", operation: "createCheckout", durationMs: 4390, status: "ERROR" },
      {
        service: "checkout-service",
        operation: "validatePaymentToken",
        durationMs: 4182,
        status: "ERROR",
        detail: "issuer mismatch introduced in v2.18.4",
      },
      {
        service: "payment-service",
        operation: "authorizePayment",
        durationMs: 382,
        status: "OK",
        detail: "upstream healthy",
      },
    ],
  },
  {
    id: "trace-2",
    correlationId: "tr_84292",
    timestamp: "12:01:43.002",
    status: "OK",
    durationMs: 608,
    spans: [
      { service: "storefront-web", operation: "GET /cart", durationMs: 608, status: "OK" },
      { service: "inventory-service", operation: "checkAvailability", durationMs: 211, status: "OK" },
    ],
  },
];

export const deployments: Deployment[] = [
  {
    id: "dep-8841",
    service: "checkout-service",
    fromVersion: "v2.18.3",
    toVersion: "v2.18.4",
    deployedAt: "2026-08-29T12:00:06.000Z",
    status: "SUCCEEDED",
    summary: "Stricter payment-token issuer validation.",
  },
  {
    id: "dep-8838",
    service: "storefront-web",
    fromVersion: "v5.42.0",
    toVersion: "v5.42.1",
    deployedAt: "2026-08-29T10:24:11.000Z",
    status: "SUCCEEDED",
    summary: "Accessibility and cart rendering fixes.",
  },
  {
    id: "dep-8831",
    service: "notification-service",
    fromVersion: "v1.24.4",
    toVersion: "v1.24.5",
    deployedAt: "2026-08-28T18:05:42.000Z",
    status: "SUCCEEDED",
    summary: "Email template metadata update.",
  },
];

export const runbooks: Runbook[] = [
  {
    id: "RB-17",
    title: "Checkout failures after deployment",
    steps: [
      "Correlate incident onset with recent releases.",
      "Inspect checkout traces and token validation logs.",
      "Verify payment and inventory dependency health.",
      "Simulate a rollback to the prior known-good release.",
      "Request explicit human approval.",
      "Execute the approved rollback and monitor recovery.",
    ],
  },
];

export const dependencies = {
  "storefront-web": { upstream: [], downstream: ["checkout-service"] },
  "checkout-service": {
    upstream: ["storefront-web"],
    downstream: ["payment-service", "inventory-service", "order-service"],
  },
  "payment-service": { upstream: ["checkout-service"], downstream: [] },
  "inventory-service": { upstream: ["checkout-service"], downstream: ["order-service"] },
  "order-service": { upstream: ["checkout-service", "inventory-service"], downstream: ["notification-service"] },
  "notification-service": { upstream: ["order-service"], downstream: [] },
} as const;
