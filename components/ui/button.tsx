import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "critical" | "ghost";

export function Button({
  className,
  variant = "secondary",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] border px-4 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45",
        variant === "primary" &&
          "border-[var(--accent)] bg-[var(--accent)] text-white hover:border-[var(--accent-strong)] hover:bg-[var(--accent-strong)]",
        variant === "secondary" &&
          "border-[var(--border-strong)] bg-[var(--panel-strong)] text-[var(--text)] hover:bg-[var(--panel-hover)]",
        variant === "critical" && "border-red-400/30 bg-red-400/10 text-[var(--critical-soft)] hover:bg-red-400/20",
        variant === "ghost" &&
          "border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--panel-hover)] hover:text-[var(--text)]",
        className,
      )}
      {...props}
    />
  );
}
