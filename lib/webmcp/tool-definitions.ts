import { z } from "zod";
import type { ActivityCategory } from "@/lib/domain/types";
import { toolSchemas, type ToolName } from "./tool-schemas";

export interface ToolDefinition {
  name: ToolName;
  title: string;
  description: string;
  category: ActivityCategory;
  inputSchema: Record<string, unknown>;
  readOnly: boolean;
}

const description = (text: string) => text;

export const toolDefinitions: ToolDefinition[] = [
  { name: "get_active_incident", title: "Get active incident", description: description("Return the active production incident, its severity, customer impact, current lifecycle status, and current hypothesis."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.get_active_incident) },
  { name: "list_services", title: "List services", description: description("List every simulated service with health, deployed version, request rate, error rate, and p95 latency."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.list_services) },
  { name: "query_service_metrics", title: "Query service metrics", description: description("Query a deterministic metric time series for one known service and supported time range. Use this to quantify incident onset and recovery."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.query_service_metrics) },
  { name: "search_logs", title: "Search logs", description: description("Search synthetic structured logs by service, severity, keyword, and optional time range. Results include correlation IDs."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.search_logs) },
  { name: "search_traces", title: "Search traces", description: description("Search distributed trace summaries and spans by service, status, or correlation ID to localize a failure."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.search_traces) },
  { name: "get_service_dependencies", title: "Get service dependencies", description: description("Return upstream and downstream dependencies for a service and highlight that path in the visible topology."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.get_service_dependencies) },
  { name: "get_recent_deployments", title: "Get recent deployments", description: description("Return deterministic recent deployments, optionally filtered to a service, within a supported time range."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.get_recent_deployments) },
  { name: "compare_deployments", title: "Compare deployments", description: description("Compare two known service versions and return the concise behavioral change relevant to the incident."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.compare_deployments) },
  { name: "search_runbooks", title: "Search runbooks", description: description("Search the deterministic runbook library for a safe incident-response procedure."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.search_runbooks) },
  { name: "simulate_rollback", title: "Simulate rollback", description: description("Estimate the effects, confidence, risk, and recovery time of a rollback without changing any operational state."), category: "SIMULATION", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.simulate_rollback) },
  { name: "estimate_customer_impact", title: "Estimate customer impact", description: description("Return synthetic checkout attempts, affected users, failed orders, and revenue exposure for the active incident."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.estimate_customer_impact) },
  { name: "request_rollback", title: "Request rollback approval", description: description("Create a visible pending rollback request for explicit human review. This never performs the rollback."), category: "APPROVAL", readOnly: false, inputSchema: z.toJSONSchema(toolSchemas.request_rollback) },
  { name: "get_action_status", title: "Get action status", description: description("Check whether a proposed action is pending, human-approved, rejected, executed, or failed."), category: "READ", readOnly: true, inputSchema: z.toJSONSchema(toolSchemas.get_action_status) },
  { name: "execute_approved_action", title: "Execute approved action", description: description("Execute a rollback only after the matching action has been explicitly approved in the visible human interface."), category: "ACTION", readOnly: false, inputSchema: z.toJSONSchema(toolSchemas.execute_approved_action) },
  { name: "update_incident", title: "Update incident", description: description("Add a concise incident status update or resolve the active incident. Resolution is rejected until recovery is complete."), category: "ACTION", readOnly: false, inputSchema: z.toJSONSchema(toolSchemas.update_incident) },
];

export const toolDefinitionByName = Object.fromEntries(toolDefinitions.map((tool) => [tool.name, tool])) as Record<ToolName, ToolDefinition>;
