import { test, expect } from '@playwright/test';

test('test existence', async ({ page }) => {
  await page.goto('http://localhost:3000/trips/new');
  // Enter Berlin into the origin field
  await page.fill('input[name=from_name]', 'Berlin');
  await page.fill('input[name=to_name]', 'Hamburg');
  await page.fill('input[name=departure_date]', '2021-06-01 12:00:00');
  await page.fill('input[name=arrival_date]', '2021-06-02 18:00:00');
  await page.click('text=Save Trip');
  // show screenshots
  await page.screenshot({ path: `./screenshots/create.png` });
});

