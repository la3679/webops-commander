"use client";

import { Boxes, ChevronDown, GitFork } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";
import { cn } from "@/lib/utils/cn";
import { useCommanderStore } from "@/lib/store/use-commander-store";

export function ServiceTopology() {
  const services = useCommanderStore((state) => state.services);
  const highlighted = useCommanderStore((state) => state.highlightedServices);
  return (
    <Panel className="min-h-[380px] overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold">
            <GitFork aria-hidden="true" className="text-violet-300" size={16} />
            Service topology
          </div>
          <p className="mt-1 text-xs text-[var(--muted)]">Checkout path and downstream dependencies</p>
        </div>
        <Badge>6 services</Badge>
      </div>
      <div className="relative p-5">
        <div className="mx-auto flex max-w-md flex-col items-center">
          <TopologyNode name="storefront-web" services={services} highlighted={highlighted} />
          <Connector />
          <TopologyNode name="checkout-service" services={services} highlighted={highlighted} critical />
          <div className="my-2 flex w-[76%] items-center">
            <div className="h-px flex-1 bg-[var(--border-strong)]" />
            <ChevronDown aria-hidden="true" className="text-[var(--muted)]" size={15} />
            <div className="h-px flex-1 bg-[var(--border-strong)]" />
          </div>
          <div className="grid w-full grid-cols-3 gap-2">
            {["payment-service", "inventory-service", "order-service"].map((name) => (
              <TopologyNode compact highlighted={highlighted} key={name} name={name} services={services} />
            ))}
          </div>
          <Connector />
          <TopologyNode compact highlighted={highlighted} name="notification-service" services={services} />
        </div>
        <details className="mt-5 border-t border-[var(--border)] pt-3 text-xs text-[var(--muted)]">
          <summary className="min-h-8 cursor-pointer py-2 font-medium text-slate-300">
            Accessible dependency list
          </summary>
          <ul className="mt-2 space-y-1.5">
            <li>storefront-web → checkout-service</li>
            <li>checkout-service → payment-service, inventory-service, order-service</li>
            <li>order-service → notification-service</li>
          </ul>
        </details>
      </div>
    </Panel>
  );
}

function Connector() {
  return <div aria-hidden="true" className="h-5 w-px bg-[var(--border-strong)]" />;
}
function TopologyNode({
  name,
  services,
  highlighted,
  critical = false,
  compact = false,
}: {
  name: string;
  services: ReturnType<typeof useCommanderStore.getState>["services"];
  highlighted: readonly string[];
  critical?: boolean;
  compact?: boolean;
}) {
  const service = services.find((item) => item.name === name)!;
  const active = highlighted.includes(name);
  const unhealthy = service.health !== "HEALTHY";
  return (
    <div
      className={cn(
        "relative flex items-center gap-2 rounded-[10px] border bg-[#0b0f15] px-3 py-2.5 transition-[border-color,box-shadow] duration-300",
        compact ? "min-w-0 justify-center" : "min-w-[220px]",
        unhealthy ? "border-red-400/35 shadow-[0_0_25px_rgba(255,95,109,.09)]" : "border-[var(--border)]",
        active && "border-violet-300/70 shadow-[0_0_28px_rgba(139,131,255,.24)]",
      )}
    >
      <Boxes aria-hidden="true" className={unhealthy ? "text-red-300" : "text-emerald-300"} size={14} />
      <div className="min-w-0">
        <div className="truncate font-mono text-[10px] sm:text-[11px]">{name}</div>
        {!compact && (
          <div className="mt-0.5 text-[9px] text-[var(--muted)]">
            {service.version} · {service.health}
          </div>
        )}
      </div>
      {critical && (
        <span
          aria-label="Degraded"
          className="absolute -right-1 -top-1 size-2.5 rounded-full bg-red-400 shadow-[0_0_0_4px_rgba(255,95,109,.12)]"
        />
      )}
    </div>
  );
}
