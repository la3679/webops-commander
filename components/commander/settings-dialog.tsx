"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Bug, CheckCircle2, ExternalLink, RotateCcw, Settings2, ShieldCheck, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommanderStore } from "@/lib/store/use-commander-store";
import { cn } from "@/lib/utils/cn";

type SettingsTab = "demo" | "webmcp";

export function SettingsDialog({
  open,
  onOpenChange,
  developerTesterOpen,
  onDeveloperTesterOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  developerTesterOpen: boolean;
  onDeveloperTesterOpenChange: (open: boolean) => void;
}) {
  const [tab, setTab] = useState<SettingsTab>("demo");
  const resetDemo = useCommanderStore((state) => state.resetDemo);
  const webMcpStatus = useCommanderStore((state) => state.webMcpStatus);

  const openTester = () => {
    onDeveloperTesterOpenChange(true);
    onOpenChange(false);
  };

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm data-[state=open]:animate-[fade-in_.2s_ease-out]" />
        <Dialog.Content
          aria-describedby="settings-description"
          className="fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-[680px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[18px] border border-[var(--border-strong)] bg-[#10151e] shadow-[0_35px_120px_rgba(0,0,0,.75)] focus:outline-none"
        >
          <header className="flex items-start gap-4 border-b border-[var(--border)] p-5 sm:p-6">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
              <Settings2 aria-hidden="true" size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-xl font-semibold tracking-[-.025em]">Command center settings</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm leading-5 text-[var(--muted)]" id="settings-description">
                Control the deterministic demo and inspect its browser-native tool surface.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button aria-label="Close settings" variant="ghost">
                <X aria-hidden="true" size={16} />
              </Button>
            </Dialog.Close>
          </header>

          <div className="border-b border-[var(--border)] px-5 sm:px-6">
            <div aria-label="Settings sections" className="flex gap-1" role="tablist">
              {(["demo", "webmcp"] as const).map((name) => (
                <button
                  aria-controls={`settings-panel-${name}`}
                  aria-selected={tab === name}
                  className={cn(
                    "min-h-11 cursor-pointer border-b-2 px-4 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                    tab === name
                      ? "border-violet-300 text-white"
                      : "border-transparent text-[var(--muted)] hover:text-white",
                  )}
                  id={`settings-tab-${name}`}
                  key={name}
                  onClick={() => setTab(name)}
                  role="tab"
                  type="button"
                >
                  {name === "demo" ? "Demo controls" : "WebMCP"}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[58dvh] overflow-y-auto p-5 sm:p-6">
            {tab === "demo" ? (
              <div aria-labelledby="settings-tab-demo" className="space-y-3" id="settings-panel-demo" role="tabpanel">
                <SettingRow
                  action={
                    <Button onClick={openTester} variant={developerTesterOpen ? "ghost" : "primary"}>
                      <Bug aria-hidden="true" size={15} />
                      {developerTesterOpen ? "Return to tester" : "Open tester"}
                    </Button>
                  }
                  description="Run all 15 validated handlers manually when native WebMCP is unavailable. This is clearly separated from the real browser transport."
                  icon={Bug}
                  title="Developer Tool Tester"
                />
                <SettingRow
                  action={
                    <Button onClick={resetDemo} variant="critical">
                      <RotateCcw aria-hidden="true" size={15} /> Reset demo
                    </Button>
                  }
                  description="Restore the incident, services, metrics, activity timeline, and approval state. Any recovery timers are cancelled."
                  icon={RotateCcw}
                  title="Reset incident simulation"
                />
                <div className="flex gap-3 rounded-xl border border-emerald-300/15 bg-emerald-300/[.045] p-4 text-xs leading-5 text-emerald-100">
                  <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0" size={16} />
                  Settings affect only this deterministic browser session. No production system or customer data is
                  connected.
                </div>
              </div>
            ) : (
              <div
                aria-labelledby="settings-tab-webmcp"
                className="space-y-3"
                id="settings-panel-webmcp"
                role="tabpanel"
              >
                <div className="rounded-xl border border-[var(--border)] bg-black/15 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <ShieldCheck aria-hidden="true" className="text-violet-200" size={17} /> Native transport
                    </div>
                    <Badge tone={webMcpStatus === "CONNECTED" ? "healthy" : "neutral"}>
                      {webMcpStatus === "CONNECTED" ? "Connected" : "Unavailable here"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
                    The page registers 15 tools through <code>document.modelContext</code>. Browser extensions do not
                    enable that experimental API by themselves.
                  </p>
                  <dl className="mt-4 grid grid-cols-2 gap-3">
                    <StatusFact label="Registered tools" value="15" />
                    <StatusFact label="Approval gates" value="1 explicit" />
                  </dl>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button onClick={openTester} variant="primary">
                    <Bug aria-hidden="true" size={15} /> Open debug fallback
                  </Button>
                  <a
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] border border-[var(--border-strong)] px-4 text-sm font-semibold transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    href="https://github.com/la3679/webops-commander/blob/main/docs/WEBMCP.md"
                    rel="noreferrer"
                    target="_blank"
                  >
                    Read implementation guide <ExternalLink aria-hidden="true" size={14} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SettingRow({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description: string;
  icon: typeof Bug;
  action: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-black/15 p-4 sm:flex-row sm:items-center">
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-white/[.045] text-slate-300">
        <Icon aria-hidden="true" size={17} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{title}</div>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function StatusFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white/[.025] p-3">
      <dt className="text-[10px] font-bold tracking-[.08em] text-[var(--muted)] uppercase">{label}</dt>
      <dd className="mt-1 font-mono text-sm text-white">{value}</dd>
    </div>
  );
}
