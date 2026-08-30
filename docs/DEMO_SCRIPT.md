# Demo Guide

This guide presents the complete WebOps Commander workflow in approximately three minutes.

## Preparation

1. Start the application with `npm run dev`.
2. Open `http://localhost:3000` in a WebMCP-capable browser.
3. Keep the browser's agent interface visible.
4. Use **Reset Demo** before recording to restore the initial incident.

If native WebMCP is unavailable, use `http://localhost:3000/commander?debug=webmcp`. Describe the developer tester as a diagnostic fallback, not native transport.

## 0:00–0:20 — Introduce the product

> Operational dashboards were designed for people to click through. WebOps Commander exposes typed operational capabilities directly to an AI agent through WebMCP while keeping production-changing decisions under human control.

Highlight the three product principles on the landing page:

- native WebMCP discovery;
- explicit human authorization;
- deterministic and repeatable behavior.

Open the command center.

## 0:20–0:40 — Establish the incident

> A SEV-1 checkout incident began immediately after a deployment. Error rate is 18.4%, p95 latency is 4.7 seconds, completed orders are down 38%, and synthetic revenue exposure is $21.4K per minute.

Show the telemetry chart, degraded checkout node, evidence workspace, and initially empty activity timeline.

## 0:40–1:20 — Investigate with the agent

Send this prompt:

> Investigate the active checkout incident. Use the available WebMCP tools to identify the root cause and recommend the safest mitigation. You may inspect anything necessary, but do not execute production-changing actions without my approval.

The agent should:

1. discover the tools registered by the page;
2. inspect the incident and service health;
3. query metrics and dependencies;
4. search logs and traces;
5. compare the latest checkout deployment;
6. identify the issuer-validation regression in `v2.18.4`;
7. confirm that payment and inventory remain healthy;
8. simulate rollback to `v2.18.3`.

Emphasize that simulation predicts recovery without changing the incident.

## 1:20–1:55 — Demonstrate authorization

Ask the agent to request the recommended rollback.

> The request creates action `ACT-104`, but nothing has executed. The operator can review the exact service, source and target versions, rationale, risk, and expected recovery.

Optional negative-path demonstration: ask the agent to execute before approval and show the `ACTION_NOT_APPROVED` response.

Select **Approve rollback** in the dialog.

> Approval still does not execute the rollback. It authorizes a separate, auditable action.

Then ask:

> Execute approved action ACT-104 and monitor recovery.

## 1:55–2:25 — Observe recovery

Point out:

- the service version changing to `v2.18.3`;
- the rollback marker on the telemetry chart;
- error rate falling from 18.4% to 0.7%;
- p95 latency returning to 630 ms;
- corresponding events in the activity timeline.

Ask the agent to resolve the incident after the monitoring stage is reached.

## 2:25–2:45 — Close the demonstration

> WebOps Commander demonstrates three things: a real browser-native tool surface, an explicit human authorization boundary, and a deterministic incident workflow where the agent and operator share the same state.

Show the resolved summary, then select **Reset Demo** to prove that the scenario returns to the same initial condition.

## Verification checklist

- [ ] The WebMCP status is described accurately.
- [ ] The agent discovers typed tools rather than relying on UI automation.
- [ ] Investigation evidence identifies `checkout-service v2.18.4`.
- [ ] Simulation occurs before a rollback request.
- [ ] The request opens visible human review and does not execute.
- [ ] Approval and execution occur as separate steps.
- [ ] Recovery reaches 0.7% error rate and 630 ms p95 latency.
- [ ] The activity timeline reflects tool calls and human decisions.
- [ ] Resolution occurs only after monitoring.
- [ ] Reset restores the initial incident.
