import { expect, test } from "@playwright/test";

test("landing page leads to an active SEV-1 command center", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Production infrastructure");
  await expect(page.getByText("0", { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Launch live incident" }).click();
  await expect(page).toHaveURL(/\/commander$/);
  await expect(page.getByText("Checkout failures after checkout-service deployment")).toBeVisible();
  await expect(page.getByText("18.4%", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ready for an agent" })).toBeVisible();
});

test("debug tester exercises approval, recovery, resolution, and reset", async ({ page }) => {
  await page.goto("/commander?debug=webmcp");
  const select = page.getByLabel("Tool", { exact: true });
  await expect(page.getByRole("complementary", { name: "Developer Tool Tester" })).toBeVisible();
  await select.selectOption("request_rollback");
  await page.getByRole("button", { name: /Run Request rollback approval/ }).click();
  await expect(page.getByRole("dialog", { name: "Rollback checkout-service?" })).toBeVisible();
  await page.getByRole("button", { name: "Approve rollback" }).click();
  await select.selectOption("execute_approved_action");
  await page.getByRole("button", { name: /Run Execute approved action/ }).click();
  await expect(page.getByText("rollback in progress", { exact: false })).toBeVisible();
  await page.waitForTimeout(6_000);
  await select.selectOption("update_incident");
  await page.getByRole("button", { name: /Run Update incident/ }).click();
  await expect(page.getByRole("heading", { name: /Checkout recovered/ })).toBeVisible();
  await expect(page.getByText("UI automation required")).toBeVisible();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByText("18.4%", { exact: true })).toBeVisible();
});

test("command center remains operable at phone and landscape widths with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 812 });
  await page.goto("/commander");
  const severityBadge = page.getByText("SEV-1", { exact: true });
  const revenueMetric = page.getByText("$21.4K/min", { exact: true });
  await expect(severityBadge).toBeVisible();
  await expect(revenueMetric).toBeVisible();
  expect(await severityBadge.evaluate((element) => element.getBoundingClientRect().height <= 26)).toBe(true);
  expect(await revenueMetric.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);

  await page.setViewportSize({ width: 375, height: 812 });
  await expect(page.getByText("Checkout failures after checkout-service deployment")).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset demo" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(
    true,
  );

  await page.setViewportSize({ width: 812, height: 375 });
  await expect(page.getByRole("heading", { name: "Ready for an agent" })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(
    true,
  );
});

test("developer tester provides actionable malformed JSON feedback", async ({ page }) => {
  await page.goto("/commander?debug=webmcp");
  await page.getByLabel("JSON input").fill("{");
  await page.getByRole("button", { name: "Run Get active incident" }).click();
  await expect(page.getByText("Invalid JSON input. Enter a valid JSON object and try again.")).toBeVisible();
});

test("settings exposes demo controls and the expanded developer tester", async ({ page }) => {
  await page.goto("/commander");
  await page.getByRole("button", { name: "Open settings" }).click();
  const settings = page.getByRole("dialog", { name: "Command center settings" });
  await expect(settings).toBeVisible();
  await settings.getByRole("tab", { name: "WebMCP" }).click();
  await expect(settings.getByText("15", { exact: true })).toBeVisible();
  await settings.getByRole("tab", { name: "Demo controls" }).click();
  await settings.getByRole("button", { name: "Open tester" }).click();
  const tester = page.getByRole("complementary", { name: "Developer Tool Tester" });
  await expect(tester).toBeVisible();
  expect(await tester.evaluate((element) => element.getBoundingClientRect().width >= 900)).toBe(true);
  await tester.getByRole("button", { name: "Close developer tester" }).click();
  await expect(tester).toBeHidden();
});

test("reset cancels an in-progress recovery and confirms the reset", async ({ page }) => {
  await page.goto("/commander?debug=webmcp");
  const tester = page.getByRole("complementary", { name: "Developer Tool Tester" });
  const select = page.getByLabel("Tool", { exact: true });
  await select.selectOption("request_rollback");
  await tester.getByRole("button", { name: /Run Request rollback approval/ }).click();
  await page.getByRole("button", { name: "Approve rollback" }).click();
  await select.selectOption("execute_approved_action");
  await tester.getByRole("button", { name: /Run Execute approved action/ }).click();
  await expect(page.getByText("v2.18.3 · RECOVERING", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Reset demo" }).click();
  await expect(page.getByRole("status")).toContainText("Demo reset to the initial incident");
  await page.waitForTimeout(6_000);
  await expect(page.getByText("18.4%", { exact: true })).toBeVisible();
  await expect(page.getByText("v2.18.4 · DEGRADED", { exact: true })).toBeVisible();
});
