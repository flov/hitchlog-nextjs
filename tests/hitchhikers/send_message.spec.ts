import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // Runs before each test and signs in each page.
  await page.goto('https://localhost:3000/login');
  await page.locator('input[name="email"]').fill('florian.vallen@gmail.com');
  await page.locator('input[name="password"]').fill('opujxbd4UZcvZMVP4v');
  await page.getByText('Sign in').click();
});

test('test existence', async ({ page }) => {
  await page.goto(
    'http://localhost:3000/hitchhikers/maddythewanderer/send_message'
  );
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Hitchlog - Send message to Maddythewanderer/);
});
