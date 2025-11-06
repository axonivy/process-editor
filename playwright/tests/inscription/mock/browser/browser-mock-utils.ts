import { expect, type Locator, type Page } from '@playwright/test';

export async function assertCodeHidden(page: Page) {
  await expect(code(page)).toBeHidden();
  await expect(browserBtn(page)).toHaveCount(0);
}

export async function assertCodeVisible(page: Page) {
  await expect(code(page)).toBeVisible();
  await expect(browserBtn(page)).toHaveCount(1);
}

export function code(locator: Page | Locator) {
  return locator.getByRole('code');
}

export function browserBtn(page: Page) {
  return page.getByRole('button', { name: 'Browser' });
}

export async function applyBrowser(page: Page, browser: string, expectedSelection: string = '', rowToCheck: number, dblClick?: boolean) {
  await browserBtn(page).nth(0).click();
  const browserDialog = page.getByRole('dialog');
  await expect(browserDialog).toBeVisible();
  await browserDialog.getByText(browser).first().click();
  await browserDialog.getByRole('row').nth(rowToCheck).click();

  if (dblClick) {
    await browserDialog.getByRole('row').nth(rowToCheck).dblclick();
  } else {
    await expect(browserDialog.locator('.browser-helptext')).toHaveText(expectedSelection);
    await browserDialog.getByRole('button', { name: 'Apply' }).click();
  }

  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(browserBtn(page).nth(0)).toBeVisible();
}
