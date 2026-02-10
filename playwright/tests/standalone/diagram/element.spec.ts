import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('element resize handles', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const element = await processEditor.createActivity('User Dialog', { x: 300, y: 200 });
  await processEditor.resetSelection();
  await element.expectResizeHandles(0);
  await element.select();
  await element.expectResizeHandles(4);
});

test('helper lines', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  await processEditor.endElement.select();
  await expect(page.locator('.helper-line')).toHaveCount(0);
  await page.mouse.down();
  await expect(page.locator('.helper-line')).toHaveCount(3);
  await page.mouse.up();
  await expect(page.locator('.helper-line')).toHaveCount(0);
});

test('lane handles', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const lane = await processEditor.createLane({ x: 10, y: 100 });
  await lane.expectResizeHandles(0);
  await lane.select();
  await lane.expectResizeHandles(2);
});

test('increase element size using bottom-right handle', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const element = await processEditor.createActivity('Call', { x: 300, y: 200 });
  await processEditor.resetSelection();
  await element.select();
  const bottomRightHandle = element.getResizeHandle('bottom-right');
  const bottomRightHandleBounds = await bottomRightHandle.boundingBox();
  const topLeftHandle = element.getResizeHandle('top-left');
  const topLeftHandleBounds = await topLeftHandle.boundingBox();
  await element.expectPosition({ x: 248, y: 170 });
  await element.expectSize(112, 60);
  await element.resize(bottomRightHandle, { x: 800, y: 700 });
  await processEditor.resetSelection();
  await element.select();
  // x: 800 (mouse) = 800 diagram mouse position --> snapped on a 8x8 grid: 800
  // y: 700 (mouse) - 48 (toolbar) = 652 diagram mouse position --> snapped on a 8x8 grid: 656
  // expected position = same position for bottom right resizing = (248,170)
  // expected size = element position - diagram mouse position = (552,478)
  await element.expectPosition({ x: 248, y: 170 });
  await element.expectSize(552, 486);
  expect(topLeftHandleBounds).toStrictEqual(await topLeftHandle.boundingBox());
  expect(bottomRightHandleBounds).not.toStrictEqual(await bottomRightHandle.boundingBox());
});

test('decrease element size using top-left handle', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const element = await processEditor.createActivity('Call', { x: 300, y: 200 });
  await processEditor.resetSelection();
  await element.select();
  const bottomRightHandle = element.getResizeHandle('bottom-right');
  const bottomRightHandleBounds = await bottomRightHandle.boundingBox();
  const topLeftHandle = element.getResizeHandle('top-left');
  const topLeftHandleBounds = await topLeftHandle.boundingBox();
  await element.expectPosition({ x: 248, y: 170 });
  await element.expectSize(112, 60);
  await element.resize(topLeftHandle, { x: 300, y: 200 });
  await processEditor.resetSelection();
  await element.select();
  // x: 300 (mouse) = 800 diagram mouse position --> snapped on a 8x8 grid: 304
  // y: 200 (mouse) - 48 (toolbar) = 152 diagram mouse position --> snapped on a 8x8 grid: 152
  // expected position = snapped diagram mouse position = (304,152)
  // expected size = previous size + delta(diagram mouse position, previous position) = (56,78)
  await element.expectPosition({ x: 304, y: 152 });
  await element.expectSize(56, 78);
  expect(bottomRightHandleBounds).toStrictEqual(await bottomRightHandle.boundingBox());
  expect(topLeftHandleBounds).not.toStrictEqual(await topLeftHandle.boundingBox());
});

test('increase and decrease element size using shortcut', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const element = await processEditor.createActivity('Call', { x: 300, y: 200 });
  await processEditor.resetSelection();
  await element.select();
  await element.expectPosition({ x: 248, y: 170 });
  await element.expectSize(112, 60);
  await page.keyboard.press('Alt+KeyA');
  await expect(processEditor.toast).toContainText('Resize On:');
  await processEditor.page.keyboard.press('+');
  await element.expectPosition({ x: 248, y: 170 });
  await element.expectSize(120, 68);
  await processEditor.page.keyboard.press('-');
  await element.expectPosition({ x: 248, y: 170 });
  await element.expectSize(112, 60);
  await page.keyboard.press('Escape');
  await expect(processEditor.toast).toContainText('Resize Off:');
});
