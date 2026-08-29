"use client";

import { useState } from "react";
import { Check, Clipboard, CircleAlert, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { useCommanderStore } from "@/lib/store/use-commander-store";

export const recommendedPrompt =
  "Investigate the active checkout incident. Use the available WebMCP tools to identify the root cause and recommend the safest mitigation. You may inspect anything necessary, but do not execute production-changing actions without my approval.";

export function PromptCard() {
  const [copied, setCopied] = useState(false);
  const webMcpStatus = useCommanderStore((state) => state.webMcpStatus);
  const webMcpError = useCommanderStore((state) => state.webMcpError);
  const copy = async () => {
    await navigator.clipboard.writeText(recommendedPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <Panel className="border-violet-300/15 bg-violet-400/[.035] p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200">
          <Sparkles aria-hidden="true" size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold">Recommended agent prompt</h2>
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">“{recommendedPrompt}”</p>
        </div>
        <Button aria-label="Copy recommended agent prompt" className="shrink-0" onClick={copy}>
          {copied ? <Check aria-hidden="true" size={15} /> : <Clipboard aria-hidden="true" size={15} />}{" "}
          {copied ? "Copied" : "Copy prompt"}
        </Button>
      </div>
      {(webMcpStatus === "UNAVAILABLE" || webMcpStatus === "ERROR") && (
        <div className="mt-4 flex gap-2 rounded-lg border border-amber-300/20 bg-amber-300/[.055] p-3 text-xs leading-5 text-amber-100">
          <CircleAlert aria-hidden="true" className="mt-0.5 shrink-0" size={14} />
          <span>
            <strong>WebMCP unavailable in this browser.</strong> Open this page in a WebMCP-compatible secure browser
            context or supported ChatGPT in-app browser. {webMcpError && `Registration error: ${webMcpError}`}
          </span>
        </div>
      )}
    </Panel>
  );
}
