import { test, expect } from '@playwright/test';

test('homepage has hitchlog in title and sign up', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog/);
  await page.getByText('Sign up').click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*register/);

  await page.locator('input[name="username"]').fill('username');
  await page.locator('input[name="email"]').fill('email@example.com');
  await page.locator('input[name="password"]').fill('password');
  await page.locator('input[name="password_confirmation"]').fill('password');
  await page.locator('input[name="date_of_birth"]').fill('2000-01-01');

  await page.getByText('Create account').click();

  await expect(page.locator('#portal')).toHaveText(
    'Welcome to the Hitchlog! Please confirm your email.'
  );
});
