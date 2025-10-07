import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
});

test('process editor', async ({ page }) => {
  await ProcessEditor.openProcess(page, { file: 'processes/quickstart.p.json' });
  await screenshot(page, 'process-editor.png', { height: 350 });
});

test('outline', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/quickstart.p.json' });
  const inscription = await editor.toggleInscription();
  await inscription.toggleOutline();
  await screenshot(page, 'process-outline.png', { width: 900, height: 350 });
});

test('warning', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/warning.p.json' });
  await editor.element('dialogCall').expectHasWarning();
  await screenshot(page, 'process-editor-problem.png', { height: 250 });
});

test('swimlanes', async ({ page }) => {
  await ProcessEditor.openProcess(page, { file: 'processes/screenshot/swimlanes.p.json', waitFor: '.pool' });
  await screenshot(page, 'swimlanes.png');
});

test('extensions', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/quickstart.p.json' });
  const menu = await editor.toolbar().openElementPalette('extensions');
  await menu.expectVisible();
  for (const img of await menu.locator().locator('img').all()) {
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  }
  await screenshot(page, 'extensions.png');
});

test('connector-process', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/market/erp.p.json', waitFor: '.start\\:callSubStart' });
  const subStart = editor.element('start:callSubStart');
  const inscription = await subStart.inscribe();
  await expect(subStart.locator().getByRole('img').first()).toHaveAttribute('src', /.+user.png/);
  const start = inscription.inscriptionTab('Start');
  await start.open();
  await start.section('Mapping').close();
  await start.section('Input parameters').open();
  await screenshot(page, 'connector-process.png', { height: 400 });
});

test('connector-user', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/market/UserEnroll.p.json' });
  const subCall = editor.element('subProcessCall');
  const inscription = await subCall.inscribe();
  const img = subCall.locator().getByRole('img').first();
  await expect(img).toHaveJSProperty('complete', true);
  await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  const process = inscription.inscriptionTab('Process');
  await process.open();
  await screenshot(page, 'connector-user.png', { height: 400 });
});

async function screenshot(page: Page, name: string, size?: { width?: number; height?: number }) {
  await page.setViewportSize({ width: size?.width ?? 700, height: size?.height ?? 550 });
  const dir = process.env.SCREENSHOT_DIR ?? './target';
  const buffer = await page.screenshot({ path: `${dir}/screenshots/${name}`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(3000);
}
