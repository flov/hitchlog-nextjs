import { expect, test } from '@playwright/test';

test('test blog existence', async ({ page }) => {
  await page.goto('http://localhost:3000/blog');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog - Blog/);
});
