import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../page-objects/editor/process-editor';

test.describe('url parameters', () => {
  test('viewer mode', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, { urlQueryParam: '&mode=viewer' });
    await expect(processEditor.toolbar().locator()).toBeHidden();
    await expect(processEditor.viewport().locator()).toBeVisible();
  });

  test('preview mode', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, { urlQueryParam: '&mode=preview' });
    await expect(processEditor.toolbar().locator()).toBeHidden();
    await expect(processEditor.viewport().locator()).toBeHidden();
  });

  test('zoom and highlight', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json', urlQueryParam: '&zoom=321&highlight=183E49FD86C52941-f0' });
    const start = processEditor.startElement;
    const viewport = processEditor.viewport();
    await start.expectHighlighted();
    await expect(viewport.locator()).toBeVisible();
    await viewport.expectZoomLevel('321%');
  });

  test('multiple highlight', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, {
      file: '/processes/urlparam.p.json',
      urlQueryParam: '&zoom=321&highlight=183E49FD86C52941-f0%26183E49FD86C52941-f1'
    });
    const start = processEditor.startElement;
    const end = processEditor.endElement;
    const viewport = processEditor.viewport();
    await start.expectHighlighted();
    await end.expectHighlighted();
    await expect(viewport.locator()).toBeVisible();
  });

  test('zoom and select', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json', urlQueryParam: '&zoom=123&select=183E49FD86C52941-f0' });
    const start = processEditor.startElement;
    const viewport = processEditor.viewport();
    await start.expectSelected();
    await expect(viewport.locator()).toBeVisible();
    await viewport.expectZoomLevel('123%');
  });

  test('multiple select', async ({ page }) => {
    const processEditor = await ProcessEditor.openProcess(page, {
      file: '/processes/urlparam.p.json',
      urlQueryParam: '&zoom=123&select=183E49FD86C52941-f0%26183E49FD86C52941-f1'
    });
    const start = processEditor.startElement;
    const end = processEditor.endElement;
    const viewport = processEditor.viewport();
    await start.expectSelected();
    await end.expectSelected();
    await expect(viewport.locator()).toBeVisible();
  });

  test('theme light', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json' });
    await processEditor.expectDarkMode();

    const processEditor2 = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json', urlQueryParam: '&theme=light' });
    await processEditor2.expectLightMode();
  });

  test('theme dark', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    const processEditor = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json' });
    await processEditor.expectLightMode();

    const processEditor2 = await ProcessEditor.openProcess(page, { file: '/processes/urlparam.p.json', urlQueryParam: '&theme=dark' });
    await processEditor2.expectDarkMode();
  });
});
