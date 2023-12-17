import { expect, test } from '@playwright/test';

test('Test existence', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog - Login/);

  // Expect to show an error when login fails
  await page.locator('input[name="email"]').fill('email@example.com');
  await page.locator('input[name="password"]').fill('password');
  await page.locator('button[type="submit"]').click();
  await page.waitForSelector('.alert');
});
