import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import { cmdCtrl } from '../../page-objects/editor/test-helper';

test('copy node', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  await expect(start.locator()).toHaveCount(1);
  await start.select();
  await processEditor.copyPaste('RequestStart');
  await expect(start.locator()).toHaveCount(2);
});

test('copy multiple nodes', async ({ page, browserName }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const end = processEditor.endElement;
  const edge = processEditor.edge();
  await expect(start.locator()).toHaveCount(1);
  await expect(end.locator()).toHaveCount(1);
  await expect(edge.locator()).toHaveCount(1);
  await processEditor.multiSelect([start, end], cmdCtrl(browserName));
  await processEditor.copyPaste('RequestStart', 'TaskEnd');
  await expect(start.locator()).toHaveCount(2);
  await expect(end.locator()).toHaveCount(2);
  await expect(edge.locator()).toHaveCount(2);
});
