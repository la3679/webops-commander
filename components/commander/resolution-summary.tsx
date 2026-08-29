"use client";

import { Check, Clock3, LockKeyhole, MousePointer2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useCommanderStore } from "@/lib/store/use-commander-store";

export function ResolutionSummary() {
  const activities = useCommanderStore((state) => state.activities);
  const reset = useCommanderStore((state) => state.resetDemo);
  const approvals = activities.filter((item) => item.category === "HUMAN" && item.status === "APPROVED").length;
  const toolCalls = activities.filter((item) => item.category !== "HUMAN").length;
  return <Panel className="relative overflow-hidden p-6 sm:p-10"><div aria-hidden="true" className="absolute right-0 top-0 h-64 w-64 rounded-full bg-emerald-400/[.07] blur-3xl"/><div className="relative"><Badge tone="healthy"><Check aria-hidden="true" size={12}/>Incident resolved</Badge><h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-[-.05em] sm:text-5xl">Checkout recovered. Every decision is accounted for.</h1><p className="mt-4 max-w-2xl text-base leading-7 text-[var(--muted)]">checkout-service was rolled back from v2.18.4 to v2.18.3. Error rate returned to 0.7% and the incident was resolved after the recovery gate passed.</p>
    <div className="mt-9 grid gap-3 sm:grid-cols-4">{[["12:01:18", "Detection"], ["12:01:49", "Root cause identified"], ["12:02:07", "Rollback approved"], ["12:02:25", "Recovery"]].map(([value,label]) => <div className="rounded-xl border border-[var(--border)] bg-black/15 p-4" key={label}><Clock3 aria-hidden="true" className="text-emerald-300" size={15}/><div className="tabular-nums mt-4 font-mono text-sm">{value}</div><div className="mt-1 text-[10px] text-[var(--muted)]">{label}</div></div>)}</div>
    <div className="mt-5 grid gap-4 lg:grid-cols-2"><div className="rounded-xl border border-[var(--border)] bg-black/15 p-5"><div className="text-[10px] font-bold tracking-[.1em] text-[var(--muted)] uppercase">Cause</div><p className="mt-3 text-sm leading-6 text-slate-200">checkout-service v2.18.4 introduced incompatible payment token issuer validation.</p></div><div className="rounded-xl border border-[var(--border)] bg-black/15 p-5"><div className="text-[10px] font-bold tracking-[.1em] text-[var(--muted)] uppercase">Resolution</div><p className="mt-3 text-sm leading-6 text-slate-200">Rolled back to v2.18.3 and verified deterministic telemetry recovery.</p></div></div>
    <div className="mt-5 grid grid-cols-3 gap-3"><Outcome icon={MousePointer2} label="Agent tool calls" value={String(toolCalls)}/><Outcome icon={LockKeyhole} label="Human approvals" value={String(approvals)}/><Outcome icon={Check} label="UI automation required" value="0"/></div>
    <Button className="mt-8" onClick={reset}><RotateCcw aria-hidden="true" size={15}/>Reset and replay</Button>
  </div></Panel>;
}
function Outcome({ icon: Icon, label, value }: { icon: typeof Check; label: string; value: string }) { return <div className="rounded-xl border border-[var(--border)] bg-white/[.02] p-4"><Icon aria-hidden="true" className="text-violet-200" size={15}/><div className="tabular-nums mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-[10px] leading-4 text-[var(--muted)]">{label}</div></div>; }
