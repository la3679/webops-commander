import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "neutral" | "accent" | "critical" | "warning" | "healthy";

export function Badge({ className, tone = "neutral", ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex min-h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-[0.08em] uppercase",
        tone === "neutral" && "border-[var(--border)] bg-white/[0.035] text-[var(--muted)]",
        tone === "accent" && "border-violet-400/25 bg-violet-400/10 text-violet-200",
        tone === "critical" && "border-red-400/30 bg-red-400/10 text-red-300",
        tone === "warning" && "border-amber-400/30 bg-amber-400/10 text-amber-200",
        tone === "healthy" && "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
        className,
      )}
      {...props}
    />
  );
}
