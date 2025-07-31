import { test } from '@playwright/test';
import { ProcessEditor } from '../page-objects/editor/process-editor';

test('node removal disabled', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page, { file: 'processes/jump.p.json' });
  const start = processEditor.startElement;
  await start.select();
  await page.keyboard.press('Delete');
  // eslint-disable-next-line playwright/no-wait-for-timeout
  await page.waitForTimeout(500);
  await start.isSelected();
});
