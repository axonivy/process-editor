import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

const BAR = '.quick-actions-bar';

test('let bar open on edit label', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  await start.quickActionBar().pressShortCut('L');
  await expect(start.quickActionBar().locator()).toBeVisible();
});

test('visible bar when create all elements shortcut is pressed', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  await start.quickActionBar().pressShortCut('A');
  await expect(start.quickActionBar().locator()).toBeVisible();
});

test('visible bar when events is clicked', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  await start.quickActionBar().trigger('Events', 'startsWith');
  await expect(page.locator(BAR)).toBeVisible();
});
