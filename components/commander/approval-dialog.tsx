"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Check, ShieldAlert, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommanderStore } from "@/lib/store/use-commander-store";

export function ApprovalDialog() {
  const action = useCommanderStore((state) => state.pendingAction);
  const approve = useCommanderStore((state) => state.approveAction);
  const reject = useCommanderStore((state) => state.rejectAction);
  const open = action?.status === "PENDING";
  if (!action) return null;
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm data-[state=open]:animate-[fade-in_.2s_ease-out]" />
        <Dialog.Content
          aria-describedby="approval-description"
          className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-[520px] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-[18px] border border-[var(--border-strong)] bg-[#10151e] p-6 shadow-[0_35px_120px_rgba(0,0,0,.75)] focus:outline-none sm:p-7"
        >
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-11 place-items-center rounded-xl border border-amber-300/25 bg-amber-300/10 text-amber-200">
              <ShieldAlert aria-hidden="true" size={20} />
            </span>
            <Badge tone="warning">Awaiting human approval</Badge>
          </div>
          <Dialog.Title className="mt-5 text-2xl font-semibold tracking-[-.035em]">
            Rollback checkout-service?
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-6 text-[var(--muted)]" id="approval-description">
            An agent proposed a production-changing action. Review its evidence before authorizing execution.
          </Dialog.Description>
          <div className="mt-6 flex items-center justify-center gap-4 rounded-xl border border-[var(--border)] bg-black/20 p-5 font-mono">
            <span className="text-red-200">v2.18.4</span>
            <ArrowRight aria-hidden="true" className="text-[var(--muted)]" size={17} />
            <span className="text-emerald-200">v2.18.3</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["96%", "Expected recovery"],
              ["Low", "Risk"],
              ["<90s", "Simulated time"],
            ].map(([value, label]) => (
              <div className="rounded-xl border border-[var(--border)] bg-white/[.025] p-3 text-center" key={label}>
                <div className="tabular-nums text-sm font-semibold">{value}</div>
                <div className="mt-1 text-[9px] leading-4 text-[var(--muted)]">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-black/15 p-4">
            <div className="text-[10px] font-bold tracking-[.1em] text-[var(--muted)] uppercase">Agent reason</div>
            <p className="mt-2 text-xs leading-5 text-slate-300">“{action.reason}”</p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs">
            <span className="text-[var(--muted)]">Current error rate</span>
            <span className="font-mono text-red-200">18.4% → 0.7%</span>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-3">
            <Button onClick={() => reject(action.id)} variant="critical">
              <X aria-hidden="true" size={15} />
              Reject
            </Button>
            <Button onClick={() => approve(action.id)} variant="primary">
              <Check aria-hidden="true" size={15} />
              Approve rollback
            </Button>
          </div>
          <p className="mt-4 text-center text-[10px] leading-4 text-[var(--muted)]">
            Approval grants permission only. The agent must call <code>execute_approved_action</code> separately.
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
