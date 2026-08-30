import { expect, test } from "@playwright/test";

test.skip(!process.env.CAPTURE_DOCS, "Documentation screenshot capture is opt-in.");

test("capture verified release states", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.screenshot({ path: "public/docs/landing-v2.png", fullPage: false });

  await page.goto("/commander?debug=webmcp");
  await expect(page.getByText("18.4%", { exact: true })).toBeVisible();
  await page.screenshot({ path: "public/docs/active-incident-v2.png", fullPage: false });

  const select = page.getByLabel("Tool", { exact: true });
  await select.selectOption("request_rollback");
  await page.getByRole("button", { name: /Run Request rollback approval/ }).click();
  await expect(page.getByRole("dialog", { name: "Rollback checkout-service?" })).toBeVisible();
  await page.screenshot({ path: "public/docs/human-approval-v2.png", fullPage: false });

  await page.getByRole("button", { name: "Approve rollback" }).click();
  await select.selectOption("execute_approved_action");
  await page.getByRole("button", { name: /Run Execute approved action/ }).click();
  await page.waitForTimeout(6_000);
  await select.selectOption("update_incident");
  await page.getByRole("button", { name: /Run Update incident/ }).click();
  await expect(page.getByRole("heading", { name: /Checkout recovered/ })).toBeVisible();
  await page.screenshot({ path: "public/docs/resolved-incident-v2.png", fullPage: false });
});
