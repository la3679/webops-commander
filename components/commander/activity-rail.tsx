"use client";

import { CheckCircle2, CircleEllipsis, Clock3, LockKeyhole, RadioTower, UserRound, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { useCommanderStore } from "@/lib/store/use-commander-store";

export function ActivityRail() {
  const activities = useCommanderStore((state) => state.activities);
  const status = useCommanderStore((state) => state.webMcpStatus);
  return (
    <Panel className="min-h-[520px] self-start overflow-hidden lg:sticky lg:top-[88px] lg:h-[calc(100vh-104px)]">
      <div className="border-b border-[var(--border)] px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <RadioTower aria-hidden="true" className="text-[var(--info)]" size={17} />
            Agent activity
          </div>
          <Badge tone={status === "CONNECTED" ? "accent" : "neutral"}>{activities.length} events</Badge>
        </div>
        <p className="mt-1 text-xs text-[var(--muted)]">Actual WebMCP calls and human decisions</p>
      </div>
      <div aria-live="polite" className="h-[calc(100%-75px)] overflow-auto px-4 py-4">
        {activities.length === 0 ? (
          <div className="flex h-full min-h-[360px] flex-col items-center justify-center px-5 text-center">
            <span className="grid size-11 place-items-center rounded-[4px] border border-[var(--accent-border)] bg-[var(--accent-wash)] text-[var(--accent-text)]">
              <CircleEllipsis aria-hidden="true" size={19} />
            </span>
            <h2 className="mt-4 text-sm font-semibold">Ready for an agent</h2>
            <p className="mt-2 max-w-[230px] text-xs leading-5 text-[var(--muted)]">
              Copy the recommended prompt. Each structured tool call will appear here in real time.
            </p>
          </div>
        ) : (
          <ol className="space-y-1">
            {activities.map((activity, index) => (
              <li className="relative flex gap-3 pb-5" key={activity.id}>
                {index < activities.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[11px] top-6 h-full w-px bg-[var(--border)]" />
                )}
                <span
                  className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full border bg-[var(--panel)] ${activity.status === "FAILED" || activity.status === "REJECTED" ? "border-red-400/40 text-red-300" : activity.category === "HUMAN" ? "border-amber-300/40 text-amber-200" : "border-emerald-300/35 text-emerald-300"}`}
                >
                  {activity.category === "HUMAN" ? (
                    <UserRound aria-hidden="true" size={12} />
                  ) : activity.status === "FAILED" ? (
                    <XCircle aria-hidden="true" size={12} />
                  ) : activity.status === "AWAITING_APPROVAL" ? (
                    <LockKeyhole aria-hidden="true" size={12} />
                  ) : (
                    <CheckCircle2 aria-hidden="true" size={12} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className="break-all font-mono text-[11px] text-[var(--text)]">{activity.toolName}</span>
                    <Badge
                      tone={
                        activity.category === "ACTION"
                          ? "warning"
                          : activity.category === "APPROVAL"
                            ? "critical"
                            : activity.category === "HUMAN"
                              ? "warning"
                              : "neutral"
                      }
                    >
                      {activity.category}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate text-[10px] text-[var(--muted)]">{activity.inputSummary || "No input"}</p>
                  <p className="mt-2 text-[11px] leading-4 text-[var(--muted-strong)]">{activity.resultSummary}</p>
                  <div className="mt-2 flex items-center gap-1 text-[9px] text-[var(--muted)]">
                    <Clock3 aria-hidden="true" size={9} />
                    {new Date(activity.timestamp).toLocaleTimeString([], { hour12: false })} · {activity.durationMs}ms ·{" "}
                    {activity.status}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Panel>
  );
}
