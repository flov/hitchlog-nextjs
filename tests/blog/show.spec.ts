import { test, expect } from '@playwright/test';

test('test blog existence', async ({ page }) => {
  await page.goto('http://localhost:3000/blog/the-new-face-of-the-hitchlog-1');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog - The new face of the Hitchlog/);
});
