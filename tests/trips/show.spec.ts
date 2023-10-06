import { expect, test } from '@playwright/test';

test('test existence', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/trips/hitchhiking-trip-from-singapore-to-malacca-1544'
  );
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchhiking from Singapore to Malacca/);
});
