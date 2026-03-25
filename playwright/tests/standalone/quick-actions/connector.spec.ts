import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('actions', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const edge = processEditor.edge();
  await edge.quickActionBar().count(0);
  await edge.select();
  await edge.quickActionBar().count(7);
});

test('label edit', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const edge = processEditor.edge();
  const labelEdit = await edge.quickActionBar().editLabel();
  await labelEdit.edit('Test label');
  await edge.expectLabel('Test label');
});

test('delete', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const edge = processEditor.edge();
  await edge.quickActionBar().trigger('Delete');
  await expect(edge.locator()).toBeHidden();
});

test('bend and straigthen', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const end = processEditor.endElement;
  const edge = processEditor.edge();
  await end.move({ x: 300, y: 300 });
  await edge.expectStraightPath();

  await edge.quickActionBar().trigger('Bend', 'startsWith');
  await edge.expectBendPath();

  await edge.quickActionBar().trigger('Straight', 'startsWith');
  await edge.expectStraightPath();
});

test('reconnect', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const edge = processEditor.edge();
  const hd = await processEditor.createActivity('User Dialog');
  await expect(edge.locator()).toBeVisible();
  await expect(edge.feedbackLocator()).toBeHidden();
  const oldPath = await edge.getPath();

  await edge.quickActionBar().trigger('Reconnect', 'startsWith');
  await expect(edge.locator()).toBeVisible();
  await expect(edge.feedbackLocator()).toBeVisible();

  await hd.select();
  await expect(edge.locator()).toBeVisible();
  await expect(edge.feedbackLocator()).toBeHidden();
  await edge.expectPathIsNot(oldPath);
});
