import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import { cmdCtrl } from '../../page-objects/editor/test-helper';

test('connector bend and straigthen', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const end = processEditor.endElement;
  const edge = processEditor.edge();

  await end.move({ x: 300, y: 500 });
  await edge.expectStraightPath();

  await processEditor.resetSelection();
  await edge.quickActionBar().pressShortCut('B');
  await edge.expectBendPath();

  await edge.quickActionBar().pressShortCut('S');
  await edge.expectStraightPath();
});

test('connector reconnect', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const edge = processEditor.edge();
  await expect(edge.locator()).toBeVisible();
  await expect(edge.feedbackLocator()).toBeHidden();

  await edge.quickActionBar().pressShortCut('R');
  await expect(edge.locator()).toBeVisible();
  await expect(edge.feedbackLocator()).toBeVisible();
});

test('label edit', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const label = start.labelEdit();
  await start.expectLabel('start');
  await label.expectHidden();

  await start.quickActionBar().pressShortCut('L');
  await label.expectVisible();
  await label.edit('test label', cmdCtrl());
  await start.expectLabel('test label');
});

test('auto align', async ({ page, browserName }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const end = processEditor.endElement;
  await end.move({ x: 300, y: 300 });
  const startPos = await start.getPosition();
  const endPos = await end.getPosition();

  await processEditor.multiSelect([start, end], cmdCtrl(browserName));
  await processEditor.quickAction().pressShortCut('A');
  await start.expectPosition(startPos);
  await end.expectPosition({ x: endPos.x, y: startPos.y });
});

test('wrap, jump and unwrap', async ({ page, browserName }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const jumpOutBtn = processEditor.jumpOut();
  const start = processEditor.startElement;
  const end = processEditor.endElement;
  const embedded = processEditor.element('embeddedProcessElement');

  await processEditor.multiSelect([start, end], cmdCtrl(browserName));
  await processEditor.quickAction().pressShortCut('W');
  await expect(start.locator()).toBeHidden();
  await expect(end.locator()).toBeHidden();
  await expect(embedded.locator()).toBeVisible();

  await embedded.quickActionBar().pressShortCut('J');
  await expect(start.locator()).toBeVisible();
  await expect(end.locator()).toBeVisible();
  await expect(embedded.locator()).toBeHidden();
  await jumpOutBtn.expectVisible();

  await page.keyboard.press('J');
  await expect(start.locator()).toBeHidden();
  await expect(end.locator()).toBeHidden();
  await expect(embedded.locator()).toBeVisible();

  await embedded.quickActionBar().pressShortCut('U');
  await expect(start.locator()).toBeVisible();
  await expect(end.locator()).toBeVisible();
  await expect(embedded.locator()).toBeHidden();
});
