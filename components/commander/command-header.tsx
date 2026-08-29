"use client";

import Link from "next/link";
import { Code2, RotateCcw, ShieldCheck, WifiOff } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCommanderStore } from "@/lib/store/use-commander-store";

export function CommandHeader() {
  const incident = useCommanderStore((state) => state.incident);
  const status = useCommanderStore((state) => state.webMcpStatus);
  const reset = useCommanderStore((state) => state.resetDemo);
  const isResolved = incident.status === "RESOLVED";

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[#090c11]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[72px] max-w-[1720px] items-center gap-2 px-3 sm:gap-4 sm:px-5 xl:px-6">
        <Link aria-label="WebOps Commander home" href="/">
          <BrandMark className="hidden sm:inline-flex" />
          <BrandMark compact className="sm:hidden" />
        </Link>
        <div className="hidden h-6 w-px bg-[var(--border)] md:block" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Badge tone={isResolved ? "healthy" : "critical"}>{isResolved ? "Resolved" : "SEV-1"}</Badge>
            <span className="truncate text-sm font-semibold">{incident.title}</span>
          </div>
          <div className="mt-1 hidden items-center gap-2 text-[11px] text-[var(--muted)] md:flex">
            <span>INC-2048</span>
            <span>·</span>
            <span className="tabular-nums">Elapsed 00:08:42</span>
            <span>·</span>
            <span>{incident.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={status === "CONNECTED" ? "accent" : "neutral"} className="hidden lg:inline-flex">
            {status === "CONNECTED" ? (
              <ShieldCheck aria-hidden="true" size={12} />
            ) : (
              <WifiOff aria-hidden="true" size={12} />
            )}{" "}
            {status === "CHECKING"
              ? "Checking WebMCP"
              : status === "CONNECTED"
                ? "WebMCP connected"
                : "WebMCP unavailable"}
          </Badge>
          <a
            aria-label="Open GitHub repository"
            className="hidden min-h-11 min-w-11 items-center justify-center rounded-[10px] text-[var(--muted)] transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:inline-flex"
            href="https://github.com/la3679/webops-commander"
            rel="noreferrer"
            target="_blank"
          >
            <Code2 aria-hidden="true" size={18} />
          </a>
          <Button aria-label="Reset demo" onClick={reset} variant="ghost">
            <RotateCcw aria-hidden="true" size={15} />
            <span className="hidden sm:inline">Reset demo</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
