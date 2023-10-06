import { expect, test } from '@playwright/test';

test('test existence', async ({ page }) => {
  await page.goto('http://localhost:3000/hitchhikers');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog - Hitchhikers/);
});
