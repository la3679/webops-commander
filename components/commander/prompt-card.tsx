"use client";

import { useState } from "react";
import { Check, Clipboard, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

export const recommendedPrompt = "Investigate the active checkout incident. Use the available WebMCP tools to identify the root cause and recommend the safest mitigation. You may inspect anything necessary, but do not execute production-changing actions without my approval.";

export function PromptCard() {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(recommendedPrompt); setCopied(true); window.setTimeout(() => setCopied(false), 1800); };
  return <Panel className="flex flex-col gap-4 border-violet-300/15 bg-violet-400/[.035] p-5 sm:flex-row sm:items-center"><span className="grid size-10 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200"><Sparkles aria-hidden="true" size={17}/></span><div className="min-w-0 flex-1"><h2 className="text-sm font-semibold">Recommended agent prompt</h2><p className="mt-1 text-xs leading-5 text-[var(--muted)]">“{recommendedPrompt}”</p></div><Button aria-label="Copy recommended agent prompt" className="shrink-0" onClick={copy}>{copied ? <Check aria-hidden="true" size={15}/> : <Clipboard aria-hidden="true" size={15}/>} {copied ? "Copied" : "Copy prompt"}</Button></Panel>;
}
