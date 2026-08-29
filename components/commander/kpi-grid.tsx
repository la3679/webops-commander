"use client";

import { useMemo } from "react";
import { ArrowDownRight, ArrowUpRight, Banknote, CircleHelp, Gauge, ShoppingCart, TriangleAlert } from "lucide-react";
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
      description:
        "The percentage of checkout attempts that fail. Normal baseline is 0.6%; the deployment raised it to 18.4%.",
    },
    {
      label: "P95 latency",
      value: metrics.latencyMs >= 1000 ? `${(metrics.latencyMs / 1000).toFixed(1)}s` : `${metrics.latencyMs}ms`,
      delta: recovering ? "recovering" : "+658% from baseline",
      icon: Gauge,
      danger: true,
      description:
        "The response time experienced by 95% of checkout requests. Healthy baseline is approximately 620 milliseconds.",
    },
    {
      label: "Orders / minute",
      value: metrics.ordersPerMinute.toLocaleString(),
      delta: recovering ? "returning to baseline" : "−38% from baseline",
      icon: ShoppingCart,
      danger: !recovering,
      description:
        "Completed orders each minute. The incident reduced throughput from a baseline of roughly 792 orders per minute.",
    },
    {
      label: "Revenue at risk",
      value: `$${(metrics.revenueRisk / 1000).toFixed(1)}K/min`,
      delta: "synthetic estimate",
      icon: Banknote,
      danger: metrics.revenueRisk > 5000,
      description:
        "A synthetic estimate of revenue exposed each minute while checkout errors remain elevated. No real financial data is used.",
    },
  ];
  return (
    <section
      aria-label="Current incident metrics"
      className="grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map(({ label, value, delta, icon: Icon, danger, description }, index) => (
        <Panel
          aria-describedby={`kpi-help-${index}`}
          className="group relative min-w-0 cursor-help p-4 transition-[border-color,background-color] duration-200 hover:border-slate-500 hover:bg-[var(--panel-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:p-5"
          key={label}
          tabIndex={0}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-xs font-medium text-[var(--muted)]">{label}</div>
            <div className="flex items-center gap-2">
              <CircleHelp
                aria-hidden="true"
                className="text-slate-500 transition-colors group-hover:text-slate-300"
                size={14}
              />
              <Icon aria-hidden="true" className={danger ? "text-red-300" : "text-emerald-300"} size={16} />
            </div>
          </div>
          <div
            className={`tabular-nums mt-4 text-xl font-semibold tracking-[-.04em] sm:text-3xl ${danger ? "text-red-100" : "text-white"}`}
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
          <div
            className="pointer-events-none absolute inset-x-3 top-12 z-20 translate-y-1 rounded-lg border border-[var(--border-strong)] bg-[#090d13]/98 p-3 text-[11px] leading-5 text-slate-200 opacity-0 shadow-2xl transition-[opacity,transform] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100"
            id={`kpi-help-${index}`}
            role="tooltip"
          >
            {description}
          </div>
        </Panel>
      ))}
    </section>
  );
}
