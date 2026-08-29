# Devpost Submission Draft

## WebOps Commander

**Agent-native incident response, with humans in command.**

### Inspiration

During outages, responders stitch together dashboards, logs, traces, deployments, runbooks, and change controls. Agents can help investigate, but opaque or unrestricted production access adds risk. We asked: what if the incident console exposed a precise browser-native capability surface while consequential actions still required an explicit human decision?

### What it does

WebOps Commander simulates a complete SEV-1 checkout incident. A WebMCP-capable agent discovers 15 typed tools registered by the page to inspect the incident, query metrics, search logs and traces, map dependencies, compare deployments, find a runbook, estimate impact, and simulate rollback.

The agent can request a rollback, but that only opens visible review. A human sees the target, rationale, predicted recovery, and risk, then approves or rejects. Approval authorizes—but does not execute—a separate tool call. The UI then shows deterministic recovery and resolution. Every step appears in an audit timeline; Reset Demo restores the exact start.

### How we built it

- Next.js 16, React 19, TypeScript, and Tailwind CSS.
- Zustand for one state model shared by UI and tools.
- Zod for runtime validation and JSON Schema.
- `document.modelContext.registerTool()` for native WebMCP registration with AbortSignal cleanup.
- Recharts, Motion, Radix Dialog, and Lucide icons.
- Vitest, Testing Library, Playwright, and GitHub Actions.

### WebMCP and safety

WebMCP is central. The page registers a schema-constrained tool surface mapped directly to visible state. Read tools carry `readOnlyHint`; mutating tools do not. Registration is feature-detected, so other browsers retain a complete UI with honest status. There is no fake transport in the product flow; an optional labeled developer tester calls the same handlers only as a local fallback.

The safety protocol is two-phase: `request_rollback` creates a pending action; the human approves or rejects in the UI; `execute_approved_action` must then be called separately with that ID. The handler re-checks authorization immediately and fails closed for pending, rejected, unknown, or executed actions.

### Challenges and accomplishments

The hardest part was making the agent experience native without hiding its safety model. Tool descriptions needed operational meaning, outputs had to stay compact, and chart animation, topology, approval, execution, and responses needed one source of truth. We delivered a real 15-tool surface, complete guarded workflow, stable structured errors, responsive UI, deterministic sub-three-minute demo, and CI coverage from contracts through browser flow.

### What we learned

WebMCP changes a UI from a picture an agent interprets into a provider of explicit capabilities. The trustworthy agent UX is not silent automation; it is shared state, legible intent, and enforceable boundaries.

### What's next

Production adapters could connect observability and deployment providers, with signed operator identities, policy approvals, and tamper-evident audit storage. Those belong behind the existing contracts without changing the human authorization protocol.

### Built with

WebMCP, Next.js, React, TypeScript, Tailwind CSS, Zustand, Zod, Recharts, Motion, Radix UI, Vitest, Playwright, and GitHub Actions.

### Links

- Source: https://github.com/la3679/webops-commander
- Live demo: add after deployment
- Demo video: add after recording
