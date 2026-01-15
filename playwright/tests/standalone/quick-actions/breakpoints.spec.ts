import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('set and toggle breakpoints', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const element = processEditor.startElement;
  await expect(element.breakpointHandle).toBeHidden();
  await element.quickActionBar().trigger('Toggle Breakpoint', 'startsWith');
  await expect(element.breakpointHandle).toBeVisible();

  await element.breakpointHandle.click();
  await expect(element.breakpointHandle).toHaveClass(/disabled/);

  await element.breakpointHandle.click();
  await expect(element.breakpointHandle).not.toHaveClass(/disabled/);

  await element.quickActionBar().trigger('Toggle Breakpoint', 'startsWith');
  await expect(element.breakpointHandle).toBeHidden();
});

test('keyboard', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const element = processEditor.startElement;
  await expect(element.breakpointHandle).toBeHidden();
  await element.quickActionBar().pressShortCut('B');
  await expect(element.breakpointHandle).toBeVisible();
});
