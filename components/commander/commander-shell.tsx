"use client";

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
import { ServiceTopology } from "./service-topology";

export function CommanderShell() {
  useWebMcpRegistration();
  const incident = useCommanderStore((state) => state.incident);

  return (
    <main id="main-content" className="min-h-screen bg-[var(--canvas)]">
      <CommandHeader />
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
      <DeveloperToolTester />
    </main>
  );
}
