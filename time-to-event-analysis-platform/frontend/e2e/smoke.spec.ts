import { test, expect } from "@playwright/test";

test("app loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Time-to-Event Analysis Platform v13")).toBeVisible();
  await expect(page.getByText("CSV")).toBeVisible();
});
