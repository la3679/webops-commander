"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCommanderStore } from "@/lib/store/use-commander-store";
import { useWebMcpRegistration } from "@/lib/webmcp/register-tools";
import { ActivityRail } from "./activity-rail";
import { ApprovalDialog } from "./approval-dialog";
import { CommandHeader } from "./command-header";
import { DiagnosticsPanel } from "./diagnostics-panel";
import { DeveloperToolTester } from "./developer-tool-tester";
import { IncidentChart } from "./incident-chart";
import { KpiGrid } from "./kpi-grid";
import { PromptCard } from "./prompt-card";
import { ResolutionSummary } from "./resolution-summary";
import { SettingsDialog } from "./settings-dialog";
import { ServiceTopology } from "./service-topology";

export function CommanderShell() {
  useWebMcpRegistration();
  const incident = useCommanderStore((state) => state.incident);
  const resetRevision = useCommanderStore((state) => state.resetRevision);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [developerTesterOpen, setDeveloperTesterOpen] = useState(false);
  const [resetNoticeVisible, setResetNoticeVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDeveloperTesterOpen(new URLSearchParams(window.location.search).get("debug") === "webmcp"),
      0,
    );
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (resetRevision === 0) return;
    const showTimer = window.setTimeout(() => setResetNoticeVisible(true), 0);
    const hideTimer = window.setTimeout(() => setResetNoticeVisible(false), 2400);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, [resetRevision]);

  return (
    <main id="main-content" className="commander-canvas min-h-screen bg-[var(--canvas)]">
      <CommandHeader onOpenSettings={() => setSettingsOpen(true)} />
      <div className="mx-auto grid max-w-[1720px] gap-4 px-3 py-4 sm:px-5 lg:grid-cols-[minmax(0,1fr)_330px] xl:px-6">
        <div className="min-w-0 space-y-4">
          {incident.status === "RESOLVED" ? (
            <ResolutionSummary />
          ) : (
            <>
              <KpiGrid />
              <IncidentChart />
              <div className="grid gap-4 xl:grid-cols-[minmax(360px,.8fr)_minmax(500px,1.2fr)]">
                <ServiceTopology />
                <DiagnosticsPanel />
              </div>
              <PromptCard />
            </>
          )}
        </div>
        <ActivityRail />
      </div>
      <ApprovalDialog />
      <SettingsDialog
        developerTesterOpen={developerTesterOpen}
        onDeveloperTesterOpenChange={setDeveloperTesterOpen}
        onOpenChange={setSettingsOpen}
        open={settingsOpen}
      />
      <DeveloperToolTester onOpenChange={setDeveloperTesterOpen} open={developerTesterOpen} />
      {resetNoticeVisible && (
        <div
          aria-live="polite"
          className="fixed right-4 top-20 z-[70] flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-[4px] border border-emerald-300/25 bg-[#102019] px-4 py-3 text-xs font-semibold text-emerald-100 shadow-2xl"
          role="status"
        >
          <CheckCircle2 aria-hidden="true" size={16} /> Demo reset to the initial incident.
        </div>
      )}
    </main>
  );
}
