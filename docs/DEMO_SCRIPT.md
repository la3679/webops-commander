# WebOps Commander Demo Script

Target: **2 minutes 40 seconds**. Start on the landing page in a WebMCP-capable browser with its agent panel visible.

## 0:00–0:20 — Frame it

“Operational dashboards were made for humans to click through. WebOps Commander makes the website itself legible and actionable to an AI agent through native WebMCP—while keeping production-changing decisions with a human.”

Point out Native WebMCP, Human approval, and Deterministic demo. Enter the command center.

## 0:20–0:40 — Establish the incident

“A SEV-1 checkout incident started after a deployment. Errors are 18.4%, latency is 4.7 seconds, orders are down 38%, and exposure is $21.4K per minute.” Show the chart, checkout node, evidence tabs, and empty activity rail.

## 0:40–1:20 — Agent investigation

Send:

> Investigate the active checkout incident. Use the available WebMCP tools to identify the root cause and recommend the safest mitigation. You may inspect anything necessary, but do not execute production-changing actions without my approval.

“The agent discovers typed tools directly from the page. It reads the incident, metrics, logs, traces, topology, and deployments. It correlates the `v2.18.4` issuer-validation change with failed checkout traces while payment and inventory stay healthy.” When rollback is simulated: “Simulation predicts recovery without changing state.”

## 1:20–1:55 — Prove the safety boundary

Ask it to request the rollback if needed. “The request creates `ACT-104`; it executes nothing. The human sees the exact service, versions, rationale, predicted effect, and risk.” Optionally ask it to execute first and show `ACTION_NOT_APPROVED`.

Click **Approve rollback**. “Approval still does not execute. It authorizes a separate auditable call.” Ask: “Execute approved action ACT-104 and monitor recovery.”

## 1:55–2:25 — Recovery

Point to version `v2.18.3`, rollback marker, KPIs, and audit trail. “Errors fall from 18.4 to 0.7 percent and latency returns to 630 milliseconds. The agent and operator see the same state.” Ask the agent to resolve once recovery completes.

## 2:25–2:40 — Close

“This is a real WebMCP tool surface, an explicit human approval protocol, and a deterministic end-to-end incident story—all inside one browser app.” Click **Reset demo**.

## Backup path

If native WebMCP is unavailable, show the honest compatibility status and open `/commander?debug=webmcp`. The developer tester invokes the same handlers and guards but must be described as a debug aid, not native WebMCP transport.
