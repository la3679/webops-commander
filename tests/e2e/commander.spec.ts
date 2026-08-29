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
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/commander");
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
