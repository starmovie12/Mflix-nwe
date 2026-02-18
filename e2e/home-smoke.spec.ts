import { expect, test } from "@playwright/test";

test("homepage renders shell and hero", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: /mflix/i }).first()).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
