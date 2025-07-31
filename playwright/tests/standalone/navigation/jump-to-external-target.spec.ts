import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { jumpToExternalTargetAndAssert } from '../../page-objects/editor/navigation-helper';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('trigger process', async ({ page }) => {
  await jumpToExternalTargetAndAssert(page, '183E4A356E771204-f3', '1842D6FBB6A107AB', '1842D6FBB6A107AB-f0');
});

test('sub process', async ({ page }) => {
  await jumpToExternalTargetAndAssert(page, '183E4A356E771204-f6', '183E4A4179C3C69B', '183E4A4179C3C69B-f0');
});

test('embedded process', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page, { file: 'processes/jump.p.json' });
  const viewport = processEditor.viewport();
  const jumpOutBtn = processEditor.jumpOut();
  const embedded = processEditor.elementByPid('183E4A356E771204-S10');
  const script = processEditor.elementByPid('183E4A356E771204-S10-f9');
  await viewport.expectGraphOriginViewport();

  await embedded.select();
  await viewport.triggerCenter();
  await viewport.expectGraphNotOriginViewport();

  await embedded.quickActionBar().trigger('Jump', 'startsWith');
  await expect(script.locator()).toBeVisible();
  await viewport.expectGraphOriginViewport();
  await jumpOutBtn.expectVisible();

  await jumpOutBtn.click();
  await expect(script.locator()).toBeHidden();
  await expect(embedded.locator()).toBeVisible();
  await viewport.expectGraphNotOriginViewport();
});

test('unknown trigger process', async ({ page }) => {
  await assertJumpToUnknownTarget(page, 'Trigger');
});

test('unknown sub process', async ({ page }) => {
  await assertJumpToUnknownTarget(page, 'Call');
});

const assertJumpToUnknownTarget = async (page: Page, element: string) => {
  const editor = await ProcessEditor.openProcess(page);
  const trigger = await editor.createActivity(element);
  await trigger.quickActionBar().trigger('Jump', 'startsWith');
  await trigger.expectSelected();
  await editor.inscription().expectHeaderText(element);
};
