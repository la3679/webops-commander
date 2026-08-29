"use client";

import { useEffect, useMemo, useState } from "react";
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

export function DeveloperToolTester() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(true);
  const [name, setName] = useState<ToolName>("get_active_incident");
  const [input, setInput] = useState(JSON.stringify(defaults.get_active_incident, null, 2));
  const [output, setOutput] = useState("Run a handler to inspect its structured result.");
  useEffect(() => {
    const task = window.setTimeout(
      () => setVisible(new URLSearchParams(window.location.search).get("debug") === "webmcp"),
      0,
    );
    return () => window.clearTimeout(task);
  }, []);
  const title = useMemo(() => toolDefinitions.find((tool) => tool.name === name)?.title, [name]);
  if (!visible || !open) return null;
  const changeTool = (next: ToolName) => {
    setName(next);
    setInput(JSON.stringify(defaults[next], null, 2));
    setOutput("Run a handler to inspect its structured result.");
  };
  const run = async () => {
    try {
      setOutput(JSON.stringify(await executeWebMcpTool(name, JSON.parse(input)), null, 2));
    } catch (error) {
      setOutput(error instanceof Error ? error.message : "Invalid JSON input.");
    }
  };
  return (
    <aside
      aria-label="Developer Tool Tester"
      className="fixed inset-x-3 bottom-3 z-30 mx-auto max-w-3xl rounded-[16px] border border-amber-300/25 bg-[#12161f]/95 p-4 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-lg bg-amber-300/10 text-amber-200">
          <Bug aria-hidden="true" size={16} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold">
            Developer Tool Tester <Badge tone="warning">Not WebMCP transport</Badge>
          </div>
          <p className="mt-0.5 text-[10px] text-[var(--muted)]">
            Directly invokes the same validated handlers for local debugging. Calls appear in the audit rail.
          </p>
        </div>
        <Button aria-label="Close developer tester" onClick={() => setOpen(false)} variant="ghost">
          <X aria-hidden="true" size={15} />
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[210px_1fr_1fr]">
        <div>
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
        <div>
          <label className="text-[10px] font-bold text-[var(--muted)] uppercase" htmlFor="tool-input">
            JSON input
          </label>
          <textarea
            className="mt-1 h-28 w-full resize-none rounded-lg border border-[var(--border-strong)] bg-[#090c11] p-3 font-mono text-[10px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            id="tool-input"
            onChange={(event) => setInput(event.target.value)}
            value={input}
          />
        </div>
        <div>
          <div className="text-[10px] font-bold text-[var(--muted)] uppercase">Structured result</div>
          <pre className="mt-1 h-28 overflow-auto rounded-lg border border-[var(--border)] bg-[#090c11] p-3 text-[9px] text-slate-300">
            {output}
          </pre>
        </div>
      </div>
    </aside>
  );
}
