import { z } from "zod";
import { serviceNames } from "@/lib/domain/types";

const service = z.enum(serviceNames);
const timeRange = z.enum(["15m", "30m", "1h"]);

export const toolSchemas = {
  get_active_incident: z.object({}).strict(),
  list_services: z.object({}).strict(),
  query_service_metrics: z
    .object({
      service,
      metric: z.enum(["error_rate", "p95_latency", "requests_per_minute", "orders_per_minute"]),
      timeRange,
    })
    .strict(),
  search_logs: z
    .object({
      service: service.optional(),
      severity: z.enum(["INFO", "WARN", "ERROR"]).optional(),
      keyword: z.string().max(120).optional(),
      timeRange: timeRange.optional(),
    })
    .strict(),
  search_traces: z
    .object({
      service: service.optional(),
      status: z.enum(["OK", "ERROR"]).optional(),
      correlationId: z
        .string()
        .regex(/^tr_\d{5}$/)
        .optional(),
    })
    .strict(),
  get_service_dependencies: z.object({ service }).strict(),
  get_recent_deployments: z.object({ service: service.optional(), timeRange }).strict(),
  compare_deployments: z
    .object({
      service,
      fromVersion: z.string().regex(/^v\d+\.\d+\.\d+$/),
      toVersion: z.string().regex(/^v\d+\.\d+\.\d+$/),
    })
    .strict(),
  search_runbooks: z.object({ query: z.string().min(2).max(120) }).strict(),
  simulate_rollback: z.object({ service, targetVersion: z.string().regex(/^v\d+\.\d+\.\d+$/) }).strict(),
  estimate_customer_impact: z.object({ incidentId: z.literal("INC-2048").optional() }).strict(),
  request_rollback: z
    .object({ service, targetVersion: z.string().regex(/^v\d+\.\d+\.\d+$/), reason: z.string().min(20).max(500) })
    .strict(),
  get_action_status: z.object({ actionId: z.string().regex(/^ACT-\d{3}$/) }).strict(),
  execute_approved_action: z.object({ actionId: z.string().regex(/^ACT-\d{3}$/) }).strict(),
  update_incident: z
    .object({
      incidentId: z.literal("INC-2048"),
      action: z.enum(["add_status_update", "resolve_incident"]),
      message: z.string().min(5).max(280),
    })
    .strict(),
} as const;

export type ToolName = keyof typeof toolSchemas;
