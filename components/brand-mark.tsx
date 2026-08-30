import { cn } from "@/lib/utils/cn";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 font-semibold tracking-[-0.025em]", className)}>
      <span className="brand-symbol" aria-hidden="true">
        <svg fill="none" viewBox="0 0 32 32">
          <path
            d="M5 7v11.5L10.5 25l5.5-6.5V7"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path d="M27 9.5A8 8 0 1 0 27 22.5" stroke="var(--brand-secondary)" strokeLinecap="round" strokeWidth="3" />
          <circle cx="5" cy="7" fill="var(--brand-secondary)" r="2" />
          <circle cx="27" cy="22.5" fill="currentColor" r="2" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          WebOps <span className="font-normal text-[var(--muted)]">Commander</span>
        </span>
      )}
    </span>
  );
}
