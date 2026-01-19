import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { openElementInscription } from '../../page-objects/inscription/inscription-view';

export async function screenshotInscriptionTab(
  page: Page,
  pid: string,
  inscriptionTabName: string,
  screenshotName: string,
  fullView = false
) {
  const view = await openElementInscription(page, pid);
  await page.addStyleTag({ content: 'body { overflow: hidden; }' });
  const tab = view.inscriptionTab(inscriptionTabName);
  await tab.open();
  if (fullView) {
    const editor = view.page.locator('.editor');
    await editor.evaluate(element => (element.style.height = 'unset'));
    await screenshot(editor, screenshotName);
    await editor.evaluate(element => (element.style.height = '100%'));
  } else {
    await screenshot(tab.currentLocator(), screenshotName);
  }
  await tab.open();
}

export async function screenshotSection(page: Page, pid: string, inscriptionTabName: string, sectionName: string, screenshotName: string) {
  const view = await openElementInscription(page, pid);
  await page.addStyleTag({ content: 'body { overflow: hidden; }' });
  const tab = view.inscriptionTab(inscriptionTabName);
  await tab.open();
  const section = tab.section(sectionName);
  await section.open();
  await screenshot(section.currentLocator(), screenshotName);
  await tab.open();
}

export async function screenshot(page: Locator, name: string) {
  const code = page.locator('div.code-input').first();
  if (await code.isVisible()) {
    await expect(code).not.toHaveText('Loading Editor...');
  }
  const dir = process.env.SCREENSHOT_DIR ?? './target';
  const buffer = await page.screenshot({ path: `${dir}/screenshots/${name}`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(2500);
}
