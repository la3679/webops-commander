"use client";

import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, Banknote, Gauge, ShoppingCart, TriangleAlert } from "lucide-react";
import { Panel } from "@/components/ui/panel";
import { getCurrentMetrics, useCommanderStore } from "@/lib/store/use-commander-store";

export function KpiGrid() {
  const services = useCommanderStore((state) => state.services);
  const recoveryStage = useCommanderStore((state) => state.recoveryStage);
  const metrics = useMemo(() => getCurrentMetrics({ services, recoveryStage }), [services, recoveryStage]);
  const recovering = recoveryStage > 0;
  const cards = [
    {
      label: "Checkout error rate",
      value: `${metrics.errorRate.toFixed(1)}%`,
      delta: recovering ? "falling toward 0.7%" : "+17.8 percentage points",
      icon: TriangleAlert,
      danger: true,
    },
    {
      label: "P95 latency",
      value: metrics.latencyMs >= 1000 ? `${(metrics.latencyMs / 1000).toFixed(1)}s` : `${metrics.latencyMs}ms`,
      delta: recovering ? "recovering" : "+658% from baseline",
      icon: Gauge,
      danger: true,
    },
    {
      label: "Orders / minute",
      value: metrics.ordersPerMinute.toLocaleString(),
      delta: recovering ? "returning to baseline" : "−38% from baseline",
      icon: ShoppingCart,
      danger: !recovering,
    },
    {
      label: "Revenue at risk",
      value: `$${(metrics.revenueRisk / 1000).toFixed(1)}K/min`,
      delta: "synthetic estimate",
      icon: Banknote,
      danger: metrics.revenueRisk > 5000,
    },
  ];
  return (
    <section aria-label="Current incident metrics" className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map(({ label, value, delta, icon: Icon, danger }) => (
        <Panel className="min-w-0 p-4 sm:p-5" key={label}>
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs font-medium text-[var(--muted)]">{label}</div>
            <Icon aria-hidden="true" className={danger ? "text-red-300" : "text-emerald-300"} size={16} />
          </div>
          <div
            className={`tabular-nums mt-4 truncate text-2xl font-semibold tracking-[-.04em] sm:text-3xl ${danger ? "text-red-100" : "text-white"}`}
          >
            {value}
          </div>
          <div
            className={`mt-2 flex items-center gap-1 text-[11px] ${recovering ? "text-emerald-300" : "text-[var(--muted)]"}`}
          >
            {recovering ? (
              <ArrowDownRight aria-hidden="true" size={13} />
            ) : (
              <ArrowUpRight aria-hidden="true" size={13} />
            )}{" "}
            {delta}
          </div>
        </Panel>
      ))}
    </section>
  );
}
