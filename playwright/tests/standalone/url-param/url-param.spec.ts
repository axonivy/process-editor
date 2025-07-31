import { test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('readonly', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page, { urlQueryParam: '&readonly=true' });
  await processEditor.toolbar().expectReadonly();
});

test('edit mode', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  await processEditor.toolbar().expectEditMode();
});

test('theme light', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  const processEditor = await ProcessEditor.openProcess(page, { file: 'processes/urlparam.p.json' });
  await processEditor.expectDarkMode();

  const processEditor2 = await ProcessEditor.openProcess(page, { file: 'processes/urlparam.p.json', urlQueryParam: '&theme=light' });
  await processEditor2.expectLightMode();
});

test('theme dark', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  const processEditor = await ProcessEditor.openProcess(page, { file: 'processes/urlparam.p.json' });
  await processEditor.expectLightMode();

  const processEditor2 = await ProcessEditor.openProcess(page, { file: 'processes/urlparam.p.json', urlQueryParam: '&theme=dark' });
  await processEditor2.expectDarkMode();
});
