import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import { cmdCtrl } from '../../page-objects/editor/test-helper';

test('copy node', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Was not able to make it work on webkit');
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  await expect(start.locator()).toHaveCount(1);
  await start.select();
  await processEditor.copyPaste(cmdCtrl(), 'RequestStart');
  await expect(start.locator()).toHaveCount(2);
});

test('copy multiple nodes', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Was not able to make it work on webkit');
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const end = processEditor.endElement;
  const edge = processEditor.edge();
  await expect(start.locator()).toHaveCount(1);
  await expect(end.locator()).toHaveCount(1);
  await expect(edge.locator()).toHaveCount(1);
  await processEditor.multiSelect([start, end], cmdCtrl());
  await processEditor.copyPaste(cmdCtrl(browserName), 'RequestStart', 'TaskEnd');
  await expect(start.locator()).toHaveCount(2);
  await expect(end.locator()).toHaveCount(2);
  await expect(edge.locator()).toHaveCount(2);
});

test('paste raw text show toast', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Was not able to make it work on webkit');
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  await expect(start.locator()).toHaveCount(1);
  await start.select();
  await start.quickActionBar().pressShortCut('L');
  await start.labelEdit().expectVisible();
  await page.keyboard.press(`${cmdCtrl(browserName)}+A`);
  await page.keyboard.press(`${cmdCtrl()}+C`);
  await page.keyboard.press('Escape');
  await page.keyboard.press(`${cmdCtrl(browserName)}+V`);
  await expect(processEditor.toast).toContainText('Paste clipboard data does not match the process data format.');
  await expect(start.locator()).toHaveCount(1);
});
