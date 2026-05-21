import { test, expect } from '@playwright/test';

test('landing page renders', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Maya');

  const root = page.locator('#maya-root');
  await expect(root).toBeAttached();

  await expect.poll(
    async () => (await root.innerHTML()).length,
    { timeout: 30_000, message: 'maya-root should be populated by react' },
  ).toBeGreaterThan(0);

  await page.screenshot({ path: 'tests/e2e/screenshots/landing.png', fullPage: true });
});
