import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Boxes,
  Braces,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  Eye,
  FileSearch,
  GitBranch,
  LockKeyhole,
  MousePointerClick,
  Network,
  RadioTower,
  RotateCcw,
  ScrollText,
  ShieldCheck,
  TriangleAlert,
  Workflow,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Panel } from "@/components/ui/panel";

const stats = [
  ["15", "WebMCP tools"],
  ["1", "Human approval gate"],
  ["0", "UI automation steps"],
  ["100%", "Deterministic demo"],
] as const;
const oldFlow = [
  { icon: Eye, text: "Interpret screenshots" },
  { icon: MousePointerClick, text: "Guess interface controls" },
  { icon: GitBranch, text: "Reconstruct page state" },
] as const;
const webMcpFlow = [
  { icon: Braces, text: "Discover typed capabilities" },
  { icon: ShieldCheck, text: "Validate every request" },
  { icon: LockKeyhole, text: "Ask humans before change" },
] as const;

const commandCenterFeatures = [
  {
    icon: BarChart3,
    title: "Live incident telemetry",
    description: "Error rate, p95 latency, order throughput, and synthetic revenue exposure update through recovery.",
  },
  {
    icon: FileSearch,
    title: "Correlated diagnostics",
    description: "Logs, distributed traces, and deployment history point to the same issuer-validation regression.",
  },
  {
    icon: Network,
    title: "Service topology",
    description:
      "Six services reveal the checkout path, dependency health, deployed versions, and highlighted agent queries.",
  },
  {
    icon: ScrollText,
    title: "Visible activity audit",
    description:
      "Every tool call and human decision records its category, status, input, result, duration, and timestamp.",
  },
  {
    icon: ShieldCheck,
    title: "Human authorization",
    description: "Rollback requests surface scope, rationale, risk, target version, and predicted recovery for review.",
  },
  {
    icon: RotateCcw,
    title: "Deterministic recovery",
    description:
      "A staged rollback returns the incident to baseline, while Reset Demo restores the exact starting state.",
  },
] as const;

const toolGroups = [
  {
    label: "Incident context",
    tools: ["get_active_incident", "update_incident"],
    description: "Read severity, impact, lifecycle, and hypothesis; publish updates or resolve only after recovery.",
  },
  {
    label: "Service health",
    tools: ["list_services", "query_service_metrics", "get_service_dependencies"],
    description: "Inspect health, versions, traffic, telemetry, and upstream or downstream relationships.",
  },
  {
    label: "Investigation",
    tools: ["search_logs", "search_traces", "get_recent_deployments", "compare_deployments", "search_runbooks"],
    description: "Correlate evidence, isolate the failing path, compare releases, and retrieve the response procedure.",
  },
  {
    label: "Risk analysis",
    tools: ["simulate_rollback", "estimate_customer_impact"],
    description: "Forecast recovery, confidence, risk, affected users, failed orders, and synthetic revenue exposure.",
  },
  {
    label: "Guarded action",
    tools: ["request_rollback", "get_action_status", "execute_approved_action"],
    description: "Request visible approval, inspect the decision, and execute only the exact authorized action.",
  },
] as const;

const responseWorkflow = [
  ["01", "Inspect", "Read the active SEV-1 incident and current customer impact."],
  ["02", "Correlate", "Compare telemetry, logs, traces, topology, and recent deployments."],
  ["03", "Identify", "Localize the regression to checkout-service v2.18.4 issuer validation."],
  ["04", "Simulate", "Model a rollback to v2.18.3 without changing operational state."],
  ["05", "Request", "Create ACT-104 with a service, target version, and rationale."],
  ["06", "Authorize", "A human reviews the visible request and approves or rejects it."],
  ["07", "Execute", "The agent separately invokes the approved action by exact ID."],
  ["08", "Observe", "Telemetry advances through deterministic recovery stages."],
  ["09", "Resolve", "Incident resolution unlocks only after the monitoring stage."],
] as const;

const architectureLayers = [
  { icon: Code2, title: "Next.js 16 + React 19", label: "Application and interface" },
  { icon: Braces, title: "Zod + JSON Schema", label: "Runtime tool validation" },
  { icon: Database, title: "Zustand", label: "Shared browser state" },
  { icon: Workflow, title: "WebMCP", label: "Agent capability boundary" },
] as const;

export default function Home() {
  return (
    <main id="main-content" className="landing-theme relative min-h-screen overflow-hidden">
      <div aria-hidden="true" className="landing-grid pointer-events-none absolute inset-x-0 top-0 h-[52rem]" />

      <nav aria-label="Primary navigation" className="relative z-10 border-b border-[var(--border)]">
        <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-5 sm:px-8">
          <BrandMark />
          <div className="flex items-center gap-2 lg:gap-4">
            <div className="hidden items-center lg:flex">
              {[
                ["Command center", "#command-center"],
                ["Tool surface", "#tool-surface"],
                ["How it works", "#architecture"],
              ].map(([label, href]) => (
                <a
                  className="inline-flex min-h-11 items-center px-3 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                  href={href}
                  key={href}
                >
                  {label}
                </a>
              ))}
            </div>
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-[3px] bg-[var(--text)] px-4 text-sm font-semibold text-[var(--canvas)] transition-colors hover:bg-[#323638] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
              href="/commander"
            >
              Launch incident <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-[1320px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(500px,.9fr)] lg:gap-16">
          <div>
            <div className="eyebrow flex items-center gap-3 text-[var(--muted)]">
              <span className="h-px w-8 bg-[var(--accent)]" />
              Built for the WebMCP Challenge
            </div>
            <h1 className="text-balance mt-8 max-w-3xl text-[clamp(3.3rem,7vw,6.8rem)] leading-[0.88] font-semibold tracking-[-0.075em]">
              Production infrastructure,
              <span className="mt-2 block font-mono text-[.66em] leading-none font-medium tracking-[-0.055em] text-[var(--accent)]">
                agent-native.
              </span>
            </h1>
            <p className="mt-8 max-w-xl border-l-2 border-[var(--border-strong)] pl-5 text-lg leading-8 text-[var(--muted-strong)]">
              Traditional dashboards give people controls. WebOps Commander gives agents structured capabilities
              too—while humans retain authority over consequential actions.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-[var(--accent)] px-6 text-sm font-bold text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
                href="/commander"
              >
                Launch live incident <ArrowRight aria-hidden="true" size={16} />
              </Link>
              <a
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-[var(--border-strong)] bg-transparent px-6 text-sm font-semibold transition-colors hover:bg-[var(--panel-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                href="#architecture"
              >
                How WebMCP works <ChevronRight aria-hidden="true" size={16} />
              </a>
            </div>
          </div>

          <IncidentPreview />
        </div>

        <div className="mt-16 grid grid-cols-2 border-x border-t border-[var(--border)] sm:grid-cols-4 lg:mt-20">
          {stats.map(([value, label], index) => (
            <div className="border-b border-r border-[var(--border)] p-5 last:border-r-0 sm:p-6" key={label}>
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-2xl font-semibold tracking-tight sm:text-3xl">{value}</span>
                <span className="font-mono text-[9px] text-[var(--muted)]">0{index + 1}</span>
              </div>
              <div className="mt-3 text-xs font-medium text-[var(--muted)]">{label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="command-center" className="border-t border-[var(--border)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <SectionIntro
            eyebrow="Inside the command center"
            title="One workspace for the entire incident."
            description="The interface keeps the signal, evidence, service map, agent activity, authorization state, and recovery outcome in one shared operational view."
          />

          <div className="mt-14 grid border-l border-t border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {commandCenterFeatures.map(({ icon: Icon, title, description }, index) => (
              <article className="border-b border-r border-[var(--border)] p-6 sm:p-7" key={title}>
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 place-items-center border border-[var(--border-strong)] text-[var(--brand-secondary)]">
                    <Icon aria-hidden="true" size={18} />
                  </span>
                  <span className="font-mono text-[9px] text-[var(--muted)]">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 grid gap-6 border border-[var(--border-strong)] bg-[var(--panel)] p-6 sm:p-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-12">
            <div>
              <Badge tone="critical">
                <TriangleAlert aria-hidden="true" size={12} /> Checkout Meltdown
              </Badge>
              <h3 className="mt-5 text-2xl font-semibold tracking-[-.03em]">
                A complete SEV-1 story, built to be investigated.
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-4">
              {[
                ["18.4%", "Checkout errors"],
                ["4.7s", "P95 latency"],
                ["−38%", "Completed orders"],
                ["$21.4K/min", "Synthetic risk"],
              ].map(([value, label]) => (
                <div className="bg-[var(--panel)] p-4" key={label}>
                  <div className="tabular-nums font-mono text-lg font-semibold text-red-700">{value}</div>
                  <div className="mt-2 text-[10px] leading-4 text-[var(--muted)]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="tool-surface" className="landing-dark border-y border-[var(--border)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <SectionIntro
            eyebrow="15 typed WebMCP tools"
            title="The page exposes capabilities—not pixels."
            description="On a compatible secure browser, the application registers schema-constrained tools through document.modelContext. Calls use the same incident state the human sees, and every result is reflected in the visible interface."
            dark
          />

          <div className="mt-14 border-l border-t border-[var(--border)]">
            {toolGroups.map((group, index) => (
              <article
                className="grid border-b border-r border-[var(--border)] lg:grid-cols-[80px_220px_minmax(0,1fr)_minmax(260px,.72fr)]"
                key={group.label}
              >
                <div className="border-b border-[var(--border)] p-5 font-mono text-xs text-[var(--accent-text)] lg:border-r lg:border-b-0">
                  0{index + 1}
                </div>
                <div className="border-b border-[var(--border)] p-5 lg:border-r lg:border-b-0">
                  <h3 className="font-semibold">{group.label}</h3>
                  <div className="mt-2 font-mono text-[9px] tracking-wider text-[var(--muted)] uppercase">
                    {group.tools.length} tools
                  </div>
                </div>
                <div className="border-b border-[var(--border)] p-5 lg:border-r lg:border-b-0">
                  <div className="flex flex-wrap gap-2">
                    {group.tools.map((tool) => (
                      <code
                        className="border border-[var(--border)] bg-black/20 px-2.5 py-1.5 text-[10px] text-[var(--info)]"
                        key={tool}
                      >
                        {tool}
                      </code>
                    ))}
                  </div>
                </div>
                <p className="p-5 text-xs leading-5 text-[var(--muted)]">{group.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
            {[
              ["12", "Read or simulate", "Inspection is unrestricted and side-effect free."],
              ["3", "State-changing tools", "Approval and lifecycle rules are re-checked at execution."],
              ["1", "Source of truth", "The React UI and WebMCP handlers share the Zustand store."],
            ].map(([value, label, description]) => (
              <div className="bg-[var(--panel)] p-5" key={label}>
                <div className="font-mono text-2xl text-[var(--accent-text)]">{value}</div>
                <div className="mt-3 text-sm font-semibold">{label}</div>
                <p className="mt-2 text-xs leading-5 text-[var(--muted)]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="architecture"
        className="relative border-y border-[var(--border)] bg-[var(--canvas-raised)] px-5 py-20 sm:px-8 lg:py-28"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-20">
            <div>
              <div className="eyebrow text-[var(--accent-text)]">Two interfaces / One state</div>
              <p className="mt-5 max-w-xs text-sm leading-6 text-[var(--muted)]">
                No screenshot parsing. No button guessing. Every action stays visible and accountable.
              </p>
            </div>
            <div>
              <h2 className="text-balance max-w-3xl text-4xl leading-[1.02] font-semibold tracking-[-.05em] sm:text-6xl">
                Humans see the system. Agents receive capabilities.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted-strong)]">
                The browser exposes purposeful operational tools while the interface keeps every action visible and
                accountable.
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <FlowCard title="Traditional UI automation" subtitle="Fragile by construction" items={oldFlow} critical />
            <FlowCard title="WebMCP workflow" subtitle="Structured and intentional" items={webMcpFlow} />
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-6 border border-[var(--border-strong)] bg-[var(--panel)] p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <div className="flex items-start gap-3 font-semibold">
                <Check aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--brand-secondary)]" size={18} />
                One deterministic incident. Fifteen real browser tools. One explicit approval gate.
              </div>
              <p className="mt-2 pl-7 text-sm text-[var(--muted)]">
                Open the command center and investigate the Checkout Meltdown.
              </p>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[3px] bg-[var(--text)] px-6 text-sm font-bold text-[var(--canvas)] transition-colors hover:bg-[#343838] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              href="/commander"
            >
              Enter command center <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <SectionIntro
            eyebrow="The response lifecycle"
            title="From first signal to verified recovery."
            description="The deterministic scenario demonstrates the complete operating loop, including the point where autonomous investigation stops and human authority begins."
          />

          <ol className="mt-14 grid border-l border-t border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
            {responseWorkflow.map(([number, title, description]) => (
              <li className="min-h-44 border-b border-r border-[var(--border)] p-6" key={number}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-[var(--accent-text)]">{number}</span>
                  <span className="h-px w-10 bg-[var(--border-strong)]" />
                </div>
                <h3 className="mt-7 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{description}</p>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid border border-[var(--border-strong)] bg-[var(--panel)] lg:grid-cols-[1fr_1.35fr]">
            <div className="border-b border-[var(--border)] p-6 sm:p-8 lg:border-r lg:border-b-0">
              <div className="flex items-center gap-3">
                <Activity aria-hidden="true" className="text-[var(--brand-secondary)]" size={19} />
                <span className="eyebrow text-[var(--muted)]">Fixed recovery sequence</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-.03em]">
                Recovery is observable, not instantaneous.
              </h3>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                The engine advances through rollback, traffic shift, stabilization, and monitoring so the UI and agent
                can verify that mitigation worked before resolution.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[var(--border)] sm:grid-cols-5">
              {[
                ["18.4%", "Incident"],
                ["12.7%", "Rollback"],
                ["7.1%", "Traffic shift"],
                ["2.2%", "Stabilizing"],
                ["0.7%", "Monitoring"],
              ].map(([value, label]) => (
                <div className="bg-[var(--panel)] p-4" key={label}>
                  <div className="font-mono text-lg font-semibold">{value}</div>
                  <div className="mt-8 text-[10px] leading-4 text-[var(--muted)]">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--canvas-raised)] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="eyebrow text-[var(--accent-text)]">Enforceable safety</div>
              <h2 className="text-balance mt-6 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
                Approval grants permission. It does not hide execution.
              </h2>
              <p className="mt-6 text-base leading-7 text-[var(--muted-strong)]">
                The rollback protocol is deliberately two-phase. A request creates a visible pending action; a human
                decides; then the agent must call a separate execution tool with that exact approved ID.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  "Pending, rejected, unknown, or already-executed actions fail closed.",
                  "Invalid services, versions, inputs, and premature resolution return stable structured errors.",
                  "Human approval or rejection is recorded beside every agent event in the audit rail.",
                ].map((item) => (
                  <div
                    className="flex gap-3 border-l-2 border-[var(--accent)] bg-[var(--panel)] p-4 text-sm leading-6"
                    key={item}
                  >
                    <CheckCircle2
                      aria-hidden="true"
                      className="mt-0.5 shrink-0 text-[var(--brand-secondary)]"
                      size={17}
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="eyebrow text-[var(--accent-text)]">Browser-owned architecture</div>
              <h2 className="text-balance mt-6 text-4xl font-semibold tracking-[-.05em] sm:text-5xl">
                No hidden agent service. No duplicated incident model.
              </h2>
              <p className="mt-6 text-base leading-7 text-[var(--muted-strong)]">
                The WebMCP boundary stays thin: generated JSON Schemas validate calls, framework-independent handlers
                reach a deterministic engine, and the Zustand store updates the same React interface the operator is
                watching.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-px bg-[var(--border)]">
                {architectureLayers.map(({ icon: Icon, title, label }) => (
                  <div className="bg-[var(--panel)] p-5" key={title}>
                    <Icon aria-hidden="true" className="text-[var(--brand-secondary)]" size={18} />
                    <div className="mt-5 text-sm font-semibold">{title}</div>
                    <div className="mt-1 text-[10px] text-[var(--muted)]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-[1180px]">
          <SectionIntro
            eyebrow="Scope and compatibility"
            title="A real capability demo with honest boundaries."
            description="WebOps Commander is intentionally small enough to understand and deterministic enough to replay, without pretending to be a production observability backend or deployment control plane."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-2">
            <Panel className="p-6 shadow-none sm:p-8">
              <div className="flex items-center gap-3">
                <Boxes aria-hidden="true" className="text-[var(--brand-secondary)]" size={19} />
                <h3 className="text-lg font-semibold">What is included</h3>
              </div>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-[var(--muted-strong)]">
                {[
                  "One fully correlated SEV-1 checkout incident with six services and synthetic telemetry.",
                  "Native registration of 15 tools when document.modelContext is available.",
                  "A labeled developer tester that invokes the same validated handlers in any browser.",
                  "Complete approval, rejection, execution, recovery, resolution, audit, and reset states.",
                ].map((item) => (
                  <li className="flex gap-3" key={item}>
                    <Check aria-hidden="true" className="mt-1 shrink-0 text-[var(--brand-secondary)]" size={15} />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel className="p-6 shadow-none sm:p-8">
              <div className="flex items-center gap-3">
                <LockKeyhole aria-hidden="true" className="text-[var(--accent)]" size={19} />
                <h3 className="text-lg font-semibold">Deliberate constraints</h3>
              </div>
              <ul className="mt-6 space-y-4 text-sm leading-6 text-[var(--muted-strong)]">
                {[
                  "No real infrastructure, customer data, production credentials, authentication, or database.",
                  "Native agent discovery requires a compatible browser and secure context; localhost qualifies locally.",
                  "Synthetic fixtures and fixed transitions make every demo run stable and repeatable.",
                  "Browsers without WebMCP retain the full operator UI and show an honest availability state.",
                ].map((item) => (
                  <li className="flex gap-3" key={item}>
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-[var(--accent)]" /> {item}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-6 border border-[var(--border-strong)] bg-[var(--text)] p-7 text-[var(--canvas)] sm:flex-row sm:items-center sm:p-9">
            <div>
              <div className="eyebrow opacity-65">Ready to inspect the incident?</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-.035em] sm:text-3xl">
                Enter the command center and run the complete response.
              </h2>
            </div>
            <Link
              className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-[3px] bg-[var(--accent)] px-6 text-sm font-bold text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              href="/commander"
            >
              Start incident walkthrough <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-5 py-8 text-center font-mono text-[10px] tracking-wide text-[var(--muted)]">
        WebOps Commander · A deterministic WebMCP Challenge demonstration · No real infrastructure is controlled.
      </footer>
    </main>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  dark?: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-20">
      <div>
        <div className="eyebrow text-[var(--accent-text)]">{eyebrow}</div>
        <div className="mt-5 h-px w-16 bg-[var(--accent)]" />
      </div>
      <div>
        <h2 className="text-balance max-w-3xl text-4xl leading-[1.03] font-semibold tracking-[-.05em] sm:text-6xl">
          {title}
        </h2>
        <p
          className={`mt-6 max-w-2xl text-lg leading-8 ${dark ? "text-[var(--muted)]" : "text-[var(--muted-strong)]"}`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function IncidentPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute -inset-4 translate-x-4 translate-y-4 border border-[var(--border-strong)]"
      />
      <div className="relative border border-[#30383a] bg-[#101415] p-4 text-[#f4f1e8] shadow-[0_30px_70px_rgba(37,31,23,.22)] sm:p-5">
        <div className="flex items-center justify-between border-b border-[#30383a] pb-4">
          <div className="flex items-center gap-2">
            <span className="status-pulse size-2 rounded-full bg-[#ff625e]" />
            <span className="font-mono text-[10px] font-semibold tracking-[.12em] text-[#ffaaa6] uppercase">
              SEV-1 active
            </span>
          </div>
          <span className="font-mono text-[9px] tracking-wider text-[#839092]">INC-2048 / LIVE</span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-[#30383a] sm:grid-cols-4">
          {["18.4%\nError rate", "4.7s\nP95 latency", "−38%\nOrders/min", "$21.4K\nRisk/min"].map((item) => {
            const [value, label] = item.split("\n");
            return (
              <div className="bg-[#15191b] p-3.5" key={label}>
                <div className="tabular-nums font-mono text-base font-semibold text-[#ffaaa6]">{value}</div>
                <div className="mt-1 text-[9px] text-[#8f9a9c]">{label}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_180px]">
          <div className="border border-[#30383a] bg-[#0b0e0f] p-4">
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#9ba6a8]">
              <RadioTower aria-hidden="true" className="text-[#ff6b35]" size={13} /> Checkout error rate
            </div>
            <svg
              aria-label="Preview chart showing an error spike after deployment"
              className="mt-4 h-28 w-full"
              preserveAspectRatio="none"
              role="img"
              viewBox="0 0 520 120"
            >
              <defs>
                <linearGradient id="preview-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#ff625e" stopOpacity=".27" />
                  <stop offset="1" stopColor="#ff625e" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 108 L80 106 L160 107 L230 103 L270 98 L300 50 L350 24 L410 16 L460 20 L520 17 L520 120 L0 120Z"
                fill="url(#preview-fill)"
              />
              <path
                d="M0 108 L80 106 L160 107 L230 103 L270 98 L300 50 L350 24 L410 16 L460 20 L520 17"
                fill="none"
                stroke="#ff716d"
                strokeWidth="3"
              />
              <path d="M272 4 V112" stroke="#52d4cf" strokeDasharray="4 5" />
              <text fill="#7ae1dc" fontSize="9" x="280" y="13">
                DEPLOY v2.18.4
              </text>
            </svg>
          </div>
          <div className="border border-[#30383a] bg-[#0b0e0f] p-3.5">
            <div className="font-mono text-[9px] font-semibold tracking-[.1em] text-[#8f9a9c] uppercase">
              Agent activity
            </div>
            <div className="mt-3 space-y-2.5">
              {["get_active_incident", "search_traces", "compare_deployments"].map((tool, index) => (
                <div className="flex gap-2" key={tool}>
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#35cd9b]" />
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[9px] text-[#d9ddda]">{tool}</div>
                    <div className="text-[8px] text-[#738082]">SUCCESS · {42 + index * 17}ms</div>
                  </div>
                </div>
              ))}
              <div className="border-l-2 border-[#efb849] bg-[#efb849]/10 p-2 text-[9px] leading-4 text-[#f4d799]">
                Rollback awaits a human decision.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowCard({
  title,
  subtitle,
  items,
  critical = false,
}: {
  title: string;
  subtitle: string;
  items: readonly { icon: typeof Eye; text: string }[];
  critical?: boolean;
}) {
  return (
    <Panel className="overflow-hidden p-0 shadow-none">
      <div className="flex items-center justify-between border-b border-[var(--border)] p-5 sm:p-6">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">{subtitle}</p>
        </div>
        <Badge tone={critical ? "critical" : "accent"}>{critical ? "Brittle" : "Agent-native"}</Badge>
      </div>
      <div>
        {items.map(({ icon: Icon, text }, index) => (
          <div
            className="flex min-h-16 items-center gap-4 border-b border-[var(--border)] px-5 last:border-b-0 sm:px-6"
            key={text}
          >
            <span className="font-mono text-[9px] text-[var(--muted)]">0{index + 1}</span>
            <Icon
              aria-hidden="true"
              className={critical ? "text-red-700" : "text-[var(--brand-secondary)]"}
              size={18}
            />
            <span className="text-sm font-medium">{text}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
