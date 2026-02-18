import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads and displays MFLIX branding', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /MFLIX/i })).toBeVisible();
  });

  test('has navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Movies' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'TV Shows' })).toBeVisible();
  });
});
