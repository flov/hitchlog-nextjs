import { expect, test } from '@playwright/test';

test('test existence', async ({ page }) => {
  await page.goto('http://localhost:3000/hitchhikers/flov');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog - flov's profile/);
});
