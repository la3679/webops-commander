"use client";

import { useMemo, useState } from "react";
import { Bug, Play, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { executeWebMcpTool } from "@/lib/webmcp/tool-handlers";
import { toolDefinitions } from "@/lib/webmcp/tool-definitions";
import type { ToolName } from "@/lib/webmcp/tool-schemas";

const defaults: Record<ToolName, Record<string, unknown>> = {
  get_active_incident: {},
  list_services: {},
  query_service_metrics: { service: "checkout-service", metric: "error_rate", timeRange: "30m" },
  search_logs: { service: "checkout-service", severity: "ERROR", keyword: "issuer" },
  search_traces: { service: "checkout-service", status: "ERROR" },
  get_service_dependencies: { service: "checkout-service" },
  get_recent_deployments: { service: "checkout-service", timeRange: "1h" },
  compare_deployments: { service: "checkout-service", fromVersion: "v2.18.3", toVersion: "v2.18.4" },
  search_runbooks: { query: "checkout failures" },
  simulate_rollback: { service: "checkout-service", targetVersion: "v2.18.3" },
  estimate_customer_impact: { incidentId: "INC-2048" },
  request_rollback: {
    service: "checkout-service",
    targetVersion: "v2.18.3",
    reason: "Failures began immediately after v2.18.4 and traces isolate the new issuer validation step.",
  },
  get_action_status: { actionId: "ACT-104" },
  execute_approved_action: { actionId: "ACT-104" },
  update_incident: {
    incidentId: "INC-2048",
    action: "resolve_incident",
    message: "Checkout recovered after rollback; error rate and latency returned to baseline.",
  },
};

export function DeveloperToolTester({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [name, setName] = useState<ToolName>("get_active_incident");
  const [input, setInput] = useState(JSON.stringify(defaults.get_active_incident, null, 2));
  const [output, setOutput] = useState("Run a handler to inspect its structured result.");
  const title = useMemo(() => toolDefinitions.find((tool) => tool.name === name)?.title, [name]);
  if (!open) return null;
  const changeTool = (next: ToolName) => {
    setName(next);
    setInput(JSON.stringify(defaults[next], null, 2));
    setOutput("Run a handler to inspect its structured result.");
  };
  const run = async () => {
    try {
      setOutput(JSON.stringify(await executeWebMcpTool(name, JSON.parse(input)), null, 2));
    } catch (error) {
      setOutput(
        error instanceof SyntaxError
          ? "Invalid JSON input. Enter a valid JSON object and try again."
          : error instanceof Error
            ? error.message
            : "The developer tool could not run.",
      );
    }
  };
  return (
    <aside
      aria-label="Developer Tool Tester"
      className="fixed inset-x-3 bottom-3 z-30 mx-auto max-h-[calc(100dvh-1.5rem)] max-w-6xl overflow-x-hidden overflow-y-auto rounded-[18px] border border-amber-300/25 bg-[#12161f]/97 p-5 shadow-[0_30px_100px_rgba(0,0,0,.75)] backdrop-blur-xl sm:inset-x-5 sm:bottom-5 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-amber-300/10 text-amber-200">
          <Bug aria-hidden="true" size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            Developer Tool Tester <Badge tone="warning">Not WebMCP transport</Badge>
          </div>
          <p className="mt-0.5 text-[10px] text-[var(--muted)]">
            Directly invokes the same validated handlers for local debugging. Calls appear in the audit rail.
          </p>
        </div>
        <Button aria-label="Close developer tester" onClick={() => onOpenChange(false)} variant="ghost">
          <X aria-hidden="true" size={15} />
        </Button>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-[230px_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0">
          <label className="text-[10px] font-bold text-[var(--muted)] uppercase" htmlFor="tool-select">
            Tool
          </label>
          <select
            className="mt-1 min-h-11 w-full rounded-lg border border-[var(--border-strong)] bg-[#090c11] px-3 text-xs"
            id="tool-select"
            onChange={(event) => changeTool(event.target.value as ToolName)}
            value={name}
          >
            {toolDefinitions.map((tool) => (
              <option key={tool.name} value={tool.name}>
                {tool.name}
              </option>
            ))}
          </select>
          <Button className="mt-2 w-full" onClick={run} variant="primary">
            <Play aria-hidden="true" size={14} />
            Run {title}
          </Button>
        </div>
        <div className="min-w-0">
          <label className="text-[10px] font-bold text-[var(--muted)] uppercase" htmlFor="tool-input">
            JSON input
          </label>
          <textarea
            className="mt-1 h-44 w-full resize-y rounded-lg border border-[var(--border-strong)] bg-[#090c11] p-4 font-mono text-[11px] leading-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] lg:h-64"
            id="tool-input"
            onChange={(event) => setInput(event.target.value)}
            value={input}
          />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase">Structured result</div>
          <pre className="mt-1 h-44 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-[var(--border)] bg-[#090c11] p-4 text-[10px] leading-5 text-slate-300 lg:h-64">
            {output}
          </pre>
        </div>
      </div>
    </aside>
  );
}
