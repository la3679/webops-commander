import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApprovalDialog } from "@/components/commander/approval-dialog";
import { KpiGrid } from "@/components/commander/kpi-grid";
import { useCommanderStore } from "@/lib/store/use-commander-store";

describe("critical command center UI", () => {
  beforeEach(() => useCommanderStore.getState().resetDemo());

  it("renders the active incident KPIs", () => {
    render(<KpiGrid />);
    expect(screen.getByText("18.4%")).toBeVisible();
    expect(screen.getByText("4.7s")).toBeVisible();
    expect(screen.getByText("491")).toBeVisible();
    expect(screen.getByText("$21.4K/min")).toBeVisible();
  });

  it("shows evidence and approves through an explicit button", async () => {
    useCommanderStore
      .getState()
      .requestRollback("Failures began immediately after v2.18.4 and traces isolate issuer validation.");
    render(<ApprovalDialog />);
    expect(screen.getByRole("dialog", { name: "Rollback checkout-service?" })).toBeVisible();
    expect(screen.getByText("18.4% → 0.7%")).toBeVisible();
    expect(screen.getByText(/must call/)).toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Approve rollback" }));
    expect(useCommanderStore.getState().pendingAction?.status).toBe("APPROVED");
    expect(useCommanderStore.getState().activities.at(-1)).toMatchObject({ category: "HUMAN", status: "APPROVED" });
  });
});
