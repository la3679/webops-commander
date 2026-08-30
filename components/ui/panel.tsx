import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "ops-panel rounded-[6px] border border-[var(--border)] bg-[var(--panel)] shadow-[0_16px_50px_rgba(0,0,0,0.16)]",
        className,
      )}
      {...props}
    />
  );
}
