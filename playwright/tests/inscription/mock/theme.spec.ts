import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Theme mode dark', () => {
  test.use({
    colorScheme: 'dark'
  });

  test('dark browser', async ({ page }) => {
    await openMockInscription(page);
    await assertThemeMode(page, 'dark');
  });

  test('light param', async ({ page }) => {
    await openMockInscription(page, { theme: 'light' });
    await assertThemeMode(page, 'light');
  });
});

test.describe('Theme mode light', () => {
  test.use({
    colorScheme: 'light'
  });

  test('light browser', async ({ page }) => {
    await openMockInscription(page);
    await assertThemeMode(page, 'light');
  });

  test('dark param', async ({ page }) => {
    await openMockInscription(page, { theme: 'dark' });
    await assertThemeMode(page, 'dark');
  });
});

async function assertThemeMode(page: Page, theme: 'dark' | 'light'): Promise<void> {
  await expect(page.locator('html')).toHaveClass(theme);
  await expect(page.locator('html')).toHaveCSS('color-scheme', theme);
}
