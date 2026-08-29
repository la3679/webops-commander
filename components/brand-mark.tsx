import { Activity } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold tracking-[-0.02em]", className)}>
      <span className="relative grid size-8 place-items-center rounded-[9px] border border-violet-300/25 bg-violet-400/10 text-violet-200 shadow-[0_0_24px_rgba(139,131,255,0.16)]">
        <Activity aria-hidden="true" size={17} strokeWidth={2.2} />
      </span>
      {!compact && <span>WebOps Commander</span>}
    </span>
  );
}
