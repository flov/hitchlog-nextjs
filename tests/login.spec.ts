import { test, expect } from '@playwright/test';

test('Test existence', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog - Login/);
  await page.getByText('Sign up').click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*login/);

  await page.locator('input[name="username"]').fill('username');
  await page.locator('input[name="email"]').fill('email@example.com');
});
