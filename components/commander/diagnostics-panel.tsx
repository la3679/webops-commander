"use client";

import { useState } from "react";
import { GitCommitHorizontal, ListFilter, Route } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils/cn";
import { deployments, logs, traces } from "@/lib/simulation/scenario";

type Tab = "Logs" | "Traces" | "Deployments";
const tabs: { label: Tab; icon: typeof ListFilter }[] = [{ label: "Logs", icon: ListFilter }, { label: "Traces", icon: Route }, { label: "Deployments", icon: GitCommitHorizontal }];

export function DiagnosticsPanel() {
  const [tab, setTab] = useState<Tab>("Logs");
  return <Panel className="min-h-[380px] overflow-hidden"><div className="border-b border-[var(--border)] px-3 pt-2"><div aria-label="Diagnostics views" className="flex gap-1" role="tablist">{tabs.map(({ label, icon: Icon }) => <button aria-controls={`panel-${label}`} aria-selected={tab === label} className={cn("inline-flex min-h-11 cursor-pointer items-center gap-2 border-b-2 px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]", tab === label ? "border-violet-400 text-white" : "border-transparent text-[var(--muted)] hover:text-slate-200")} key={label} onClick={() => setTab(label)} role="tab"><Icon aria-hidden="true" size={14}/>{label}</button>)}</div></div><div className="h-[320px] overflow-auto p-4 font-mono text-[11px]" id={`panel-${tab}`} role="tabpanel">
    {tab === "Logs" && <div className="space-y-1.5">{logs.map((log) => <div className="grid gap-x-3 rounded-lg border border-transparent px-2 py-2 hover:border-[var(--border)] hover:bg-white/[.02] sm:grid-cols-[80px_52px_120px_1fr]" key={log.id}><span className="text-[var(--muted)]">{log.timestamp}</span><span className={log.severity === "ERROR" ? "text-red-300" : log.severity === "WARN" ? "text-amber-200" : "text-emerald-300"}>{log.severity}</span><span className="truncate text-violet-200">{log.service}</span><span className="break-words text-slate-300">{log.message} <span className="text-[var(--muted)]">trace={log.correlationId}</span></span></div>)}</div>}
    {tab === "Traces" && <div className="space-y-3">{traces.map((trace) => <div className="rounded-xl border border-[var(--border)] bg-black/15 p-3" key={trace.id}><div className="flex items-center justify-between"><span className="text-slate-200">{trace.correlationId}</span><span className={trace.status === "ERROR" ? "text-red-300" : "text-emerald-300"}>{trace.status} · {trace.durationMs}ms</span></div><div className="mt-3 space-y-2">{trace.spans.map((span, index) => <div className="flex items-start gap-2" key={`${trace.id}-${span.operation}`}><span className="text-[var(--muted)]">{index + 1}.</span><span className="text-violet-200">{span.service}</span><span className="text-slate-300">{span.operation}</span><span className="ml-auto text-[var(--muted)]">{span.durationMs}ms</span>{span.status === "ERROR" && <span className="text-red-300">ERROR</span>}</div>)}</div></div>)}</div>}
    {tab === "Deployments" && <div className="space-y-3">{deployments.map((deployment) => <div className="rounded-xl border border-[var(--border)] bg-black/15 p-4" key={deployment.id}><div className="flex items-center justify-between gap-3"><span className="text-violet-200">{deployment.service}</span><span className="text-[var(--muted)]">{deployment.deployedAt.slice(11,19)} UTC</span></div><div className="mt-2 text-sm text-slate-200">{deployment.fromVersion} <span className="text-[var(--muted)]">→</span> {deployment.toVersion}</div><p className="mt-2 font-sans text-xs text-[var(--muted)]">{deployment.summary}</p></div>)}</div>}
  </div></Panel>;
}
