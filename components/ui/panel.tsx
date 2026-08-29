import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-[var(--border)] bg-[var(--panel)] shadow-[0_18px_60px_rgba(0,0,0,0.22),inset_0_1px_rgba(255,255,255,0.025)]",
        className,
      )}
      {...props}
    />
  );
}
