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

test('create node', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;

  const quickActionBar = start.quickActionBar();
  await quickActionBar.pressShortCut('A');
  const items = quickActionBar.menu().locator().locator('.ui-palette-item');
  // search has focus initially

  await page.keyboard.press('Tab');
  await expect(items.first()).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(items.nth(1)).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(items.first()).toBeFocused();
  await page.keyboard.press('Enter');
  await processEditor.element('intermediate:taskSwitchEvent').expectSelected();

  await quickActionBar.pressShortCut('A');
  await page.keyboard.type('mail');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await processEditor.element('eMail').expectSelected();
});
