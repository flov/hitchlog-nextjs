import { expect, test } from '@playwright/test';

test('Testing Signup page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog/);
  await page.getByText('Sign up').click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*register/);
  // Expects the title to contain "Sign up".
  await expect(page).toHaveTitle(/Sign up/);

  await page.locator('input[name="username"]').fill('username');
  await page.locator('input[name="email"]').fill('email@example.com');
  await page.locator('input[name="password"]').fill('password');
  await page.locator('input[name="password_confirmation"]').fill('password');
  await page.locator('input[name="date_of_birth"]').fill('2000-01-01');

  // await page.getByText('Create account').click();
  // await expect(page.locator('#portal')).toHaveText(
  // 'Welcome to the Hitchlog! Please check your mails and confirm your email.'
  // );
});
