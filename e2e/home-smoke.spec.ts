import { expect, test } from "@playwright/test";

test("homepage renders shell and hero", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /mflix/i }).first()).toBeVisible();
  await expect(page.locator("h1, h2").first()).toBeVisible();
});
