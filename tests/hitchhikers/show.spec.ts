import { test, expect } from '@playwright/test';

test('test existence', async ({ page }) => {
  await page.goto('http://localhost:3000/hitchhikers/the_flow_wizard');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog - the_flow_wizard's profile/);
});
