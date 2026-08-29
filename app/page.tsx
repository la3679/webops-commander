import Link from "next/link";
import { ArrowRight, Bot, Braces, Check, ChevronRight, Eye, GitBranch, LockKeyhole, MousePointerClick, ShieldCheck, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

const stats = [["15", "WebMCP tools"], ["1", "Human approval gate"], ["0", "UI automation steps"], ["100%", "Deterministic demo"]] as const;
const oldFlow = [{ icon: Eye, text: "Interpret screenshots" }, { icon: MousePointerClick, text: "Guess interface controls" }, { icon: GitBranch, text: "Reconstruct page state" }] as const;
const webMcpFlow = [{ icon: Braces, text: "Discover typed capabilities" }, { icon: ShieldCheck, text: "Validate every request" }, { icon: LockKeyhole, text: "Ask humans before change" }] as const;

export default function Home() {
  return (
    <main id="main-content" className="relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="grid-noise pointer-events-none absolute inset-x-0 top-0 h-[54rem] opacity-70" />
      <nav aria-label="Primary navigation" className="relative z-10 mx-auto flex h-20 max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <BrandMark />
        <div className="flex items-center gap-3">
          <a className="hidden min-h-11 items-center px-3 text-sm text-[var(--muted)] transition-colors hover:text-white sm:inline-flex" href="#architecture">How it works</a>
          <Link className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-[var(--border-strong)] bg-[var(--panel-strong)] px-4 text-sm font-semibold transition-colors hover:bg-[var(--panel-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" href="/commander">Launch incident <ArrowRight aria-hidden="true" size={15} /></Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-[1240px] px-5 pb-24 pt-20 text-center sm:px-8 sm:pt-28 lg:pt-36">
        <Badge tone="accent" className="mb-7"><Sparkles aria-hidden="true" size={12} /> Built for the WebMCP Challenge</Badge>
        <h1 className="text-balance mx-auto max-w-5xl text-[clamp(3.1rem,8vw,7rem)] leading-[0.9] font-semibold tracking-[-0.065em]">Production infrastructure, <span className="bg-gradient-to-r from-violet-200 via-white to-slate-400 bg-clip-text text-transparent">agent-native.</span></h1>
        <p className="text-balance mx-auto mt-8 max-w-2xl text-lg leading-8 text-[var(--muted-strong)] sm:text-xl">Traditional dashboards give people controls. WebOps Commander gives agents structured capabilities too—while humans retain authority over consequential actions.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[11px] bg-white px-6 text-sm font-bold text-black transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto" href="/commander">Launch live incident <ArrowRight aria-hidden="true" size={16} /></Link>
          <a className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[11px] border border-[var(--border-strong)] bg-white/[0.025] px-6 text-sm font-semibold transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:w-auto" href="#architecture">How WebMCP works <ChevronRight aria-hidden="true" size={16} /></a>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 overflow-hidden rounded-[18px] border border-[var(--border)] bg-black/30 shadow-[0_35px_100px_rgba(0,0,0,.45)] sm:grid-cols-4">
          {stats.map(([value, label]) => <div className="border-[var(--border)] p-5 even:border-l sm:border-l sm:first:border-l-0" key={label}><div className="tabular-nums text-2xl font-semibold tracking-tight text-white">{value}</div><div className="mt-1 text-xs leading-5 text-[var(--muted)]">{label}</div></div>)}
        </div>

        <div className="relative mx-auto mt-20 max-w-5xl text-left">
          <div aria-hidden="true" className="absolute inset-x-16 -top-8 h-48 rounded-full bg-violet-500/10 blur-3xl" />
          <Panel className="relative overflow-hidden bg-[#0c1017] p-3 sm:p-5">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-2 pb-4"><div className="flex items-center gap-2"><span className="size-2 rounded-full bg-red-400" /><span className="text-xs font-bold tracking-[.12em] text-red-300 uppercase">SEV-1 active</span></div><Badge tone="accent"><span className="size-1.5 rounded-full bg-violet-300" /> WebMCP connected</Badge></div>
            <div className="grid gap-4 pt-4 lg:grid-cols-[1fr_290px]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {["18.4%\nError rate", "4.7s\nP95 latency", "−38%\nOrders/min", "$21.4K\nRisk/min"].map((item) => { const [value, label] = item.split("\n"); return <div className="rounded-xl border border-[var(--border)] bg-white/[.025] p-4" key={label}><div className="tabular-nums text-xl font-semibold text-red-200">{value}</div><div className="mt-1 text-[11px] text-[var(--muted)]">{label}</div></div>; })}
                </div>
                <div className="relative h-52 overflow-hidden rounded-xl border border-[var(--border)] bg-[#090c11] p-5">
                  <div className="text-xs font-semibold text-[var(--muted)]">Checkout error rate</div>
                  <svg aria-label="Preview chart showing an error spike after deployment" className="mt-4 h-32 w-full" preserveAspectRatio="none" role="img" viewBox="0 0 640 130"><defs><linearGradient id="preview-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#ff5f6d" stopOpacity=".28"/><stop offset="1" stopColor="#ff5f6d" stopOpacity="0"/></linearGradient></defs><path d="M0 118 L85 116 L170 117 L250 113 L300 108 L340 55 L390 25 L450 17 L520 21 L640 18 L640 130 L0 130Z" fill="url(#preview-fill)" /><path d="M0 118 L85 116 L170 117 L250 113 L300 108 L340 55 L390 25 L450 17 L520 21 L640 18" fill="none" stroke="#ff7280" strokeWidth="3" /><path d="M302 8 V122" stroke="#8b83ff" strokeDasharray="4 5" /><text fill="#bcb8ff" fontSize="10" x="310" y="16">DEPLOY v2.18.4</text></svg>
                </div>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[#090c11] p-4"><div className="flex items-center justify-between"><span className="text-xs font-bold tracking-[.1em] text-[var(--muted)] uppercase">Agent activity</span><Bot aria-hidden="true" className="text-violet-300" size={15}/></div><div className="mt-4 space-y-3">{["get_active_incident", "search_traces", "compare_deployments", "simulate_rollback"].map((tool, index) => <div className="flex gap-3" key={tool}><span className="mt-1.5 size-2 shrink-0 rounded-full bg-emerald-400"/><div><div className="font-mono text-xs text-slate-200">{tool}</div><div className="mt-1 text-[10px] text-[var(--muted)]">SUCCESS · {42 + index * 17}ms</div></div></div>)}<div className="rounded-lg border border-amber-300/25 bg-amber-300/[.06] p-3 text-xs text-amber-100"><LockKeyhole aria-hidden="true" className="mb-2" size={15}/>Rollback awaits a human decision.</div></div></div>
            </div>
          </Panel>
        </div>
      </section>

      <section id="architecture" className="relative border-t border-[var(--border)] bg-[var(--canvas-raised)] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto max-w-2xl text-center"><Badge>Two interfaces · One state</Badge><h2 className="text-balance mt-6 text-4xl font-semibold tracking-[-.04em] sm:text-5xl">Humans see the system. Agents receive capabilities.</h2><p className="mt-5 text-lg leading-8 text-[var(--muted)]">No screenshot parsing. No button guessing. The browser exposes purposeful operational tools while the interface keeps every action visible and accountable.</p></div>
          <div className="mt-14 grid gap-5 lg:grid-cols-2"><FlowCard title="Traditional UI automation" subtitle="Fragile by construction" items={oldFlow} critical /><FlowCard title="WebMCP workflow" subtitle="Structured and intentional" items={webMcpFlow} /></div>
          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-[18px] border border-violet-300/20 bg-violet-400/[.055] p-7 text-center sm:flex-row sm:text-left"><div><div className="flex items-center justify-center gap-2 font-semibold sm:justify-start"><Check aria-hidden="true" className="text-emerald-300" size={18}/>One deterministic incident. Fifteen real browser tools. One explicit approval gate.</div><p className="mt-2 text-sm text-[var(--muted)]">Open the command center and investigate the Checkout Meltdown.</p></div><Link className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[11px] bg-white px-6 text-sm font-bold text-black transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]" href="/commander">Enter command center <ArrowRight aria-hidden="true" size={16}/></Link></div>
        </div>
      </section>
      <footer className="border-t border-[var(--border)] px-5 py-8 text-center text-xs text-[var(--muted)]">WebOps Commander · A deterministic WebMCP Challenge demonstration · No real infrastructure is controlled.</footer>
    </main>
  );
}

function FlowCard({ title, subtitle, items, critical = false }: { title: string; subtitle: string; items: readonly { icon: typeof Eye; text: string }[]; critical?: boolean }) {
  return <Panel className="p-6 sm:p-7"><div className="flex items-center justify-between"><div><h3 className="font-semibold">{title}</h3><p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p></div><Badge tone={critical ? "critical" : "accent"}>{critical ? "Brittle" : "Agent-native"}</Badge></div><div className="mt-6 space-y-3">{items.map(({ icon: Icon, text }, index) => <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-black/15 p-4" key={text}><span className={critical ? "text-red-300" : "text-violet-200"}><Icon aria-hidden="true" size={18}/></span><span className="text-sm text-slate-200">{text}</span>{index < items.length - 1 && <ChevronRight aria-hidden="true" className="ml-auto text-[var(--muted)]" size={15}/>}</div>)}</div></Panel>;
}
