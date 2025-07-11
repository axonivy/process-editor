import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('tool bar button', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  await expect(processEditor.toolbar().marquee()).toBeHidden();

  await processEditor.toolbar().triggerMarquee();
  await markAndAssert(page, processEditor);
  await page.mouse.up();
  await assertAfterRelease(processEditor);
});

test('shift key', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  await expect(processEditor.toolbar().marquee()).toBeHidden();
  await processEditor.resetSelection();

  await page.keyboard.down('Shift');
  await markAndAssert(page, processEditor);
  await page.keyboard.up('Shift');
  await assertAfterRelease(processEditor);
});

async function markAndAssert(page: Page, processEditor: ProcessEditor) {
  await expect(processEditor.toolbar().marquee()).toBeVisible();
  await page.mouse.move(10, 60);
  await page.mouse.down();
  await page.mouse.move(400, 200);
  await expect(page.locator('g.selected')).toHaveCount(3);
  await expect(processEditor.quickAction().locator()).toBeHidden();
}

async function assertAfterRelease(processEditor: ProcessEditor) {
  await expect(processEditor.toolbar().marquee()).toBeHidden();
  await expect(processEditor.quickAction().locator()).toBeVisible();
  await processEditor.quickAction().count(4);
}
