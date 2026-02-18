import { expect, test } from "@playwright/test";

const hasTmdbApiKey = Boolean(process.env.TMDB_API_KEY);

test.describe("happy path smoke", () => {
  test.skip(!hasTmdbApiKey, "TMDB_API_KEY is required for content-backed happy path.");

  test("home -> detail -> watch -> my list", async ({ page }) => {
    await page.goto("/");

    const firstTitleLink = page.locator('a[href^="/title/"]').first();
    await expect(firstTitleLink).toBeVisible();
    await firstTitleLink.click();

    await expect(page).toHaveURL(/\/title\/(movie|tv)\/\d+/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const myListButton = page.getByRole("button", { name: /my list|in my list/i }).first();
    await expect(myListButton).toBeVisible();
    await myListButton.click();

    const playButton = page.getByRole("link", { name: /play|resume/i }).first();
    await expect(playButton).toBeVisible();
    await playButton.click();

    await expect(page).toHaveURL(/\/watch\/(movie|tv)\/\d+/);
    await expect(page.locator("video")).toBeVisible();

    await page.goto("/my-list");
    await expect(page.getByRole("heading", { level: 1, name: /my list/i })).toBeVisible();
  });
});
