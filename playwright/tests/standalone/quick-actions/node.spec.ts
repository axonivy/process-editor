import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import { cmdCtrl } from '../../page-objects/editor/test-helper';

test('event actions', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const end = processEditor.endElement;

  await start.quickActionBar().count(0);
  await start.select();
  await start.quickActionBar().count(8);
  await end.select();
  await end.quickActionBar().count(5);
  await end.delete();
  await start.select();
  await start.quickActionBar().count(9);
});

test('label edit', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  await start.expectLabel('start');
  const labelEdit = await start.quickActionBar().editLabel();
  await labelEdit.edit('test label', cmdCtrl());
  await start.expectLabel('test label');
});

test('custom icon', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const userDialog = await processEditor.createActivity('User Dialog', { x: 300, y: 100 });
  await expect(userDialog.icon).toBeVisible();
  const menu = await userDialog.quickActionBar().changeIcon();
  await menu.expectGroups(['Default', 'Web Content', 'Standard Icons']);
  for (const img of await menu.locator().locator('img').all()) {
    await expect(img).toHaveJSProperty('complete', true);
    await expect(img).not.toHaveJSProperty('naturalWidth', 0);
  }
  await expect(menu.items(menu.group('Web Content'))).toHaveCount(3);
  await expect(menu.item('Default').locator('svg')).toBeVisible();

  await menu.click('Compensate');
  await expect(userDialog.icon).toBeVisible();
  await expect(userDialog.icon.locator('svg path')).toHaveAttribute('d', /M 9.167969/);

  await userDialog.quickActionBar().changeIcon();
  await menu.click('NoDecorator');
  await expect(userDialog.icon).toBeHidden();

  await userDialog.quickActionBar().changeIcon();
  await menu.click('Developer');
  await expect(userDialog.icon).toBeVisible();
  await expect(userDialog.icon.locator('img')).toHaveAttribute('src', /Developer.jpg/);

  await userDialog.quickActionBar().changeIcon();
  await menu.click('Default');
  await expect(userDialog.icon).toBeVisible();
  await expect(userDialog.icon.locator('svg path')).toHaveAttribute('d', /M10 11.23C10.94/);
});

test('delete', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  await start.quickActionBar().trigger('Delete');
  await expect(start.locator()).toBeHidden();
});

test('connect', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const end = processEditor.endElement;
  const edge = processEditor.edge();
  await edge.delete();

  await start.quickActionBar().trigger('Connect');
  await expect(edge.feedbackLocator()).toBeVisible();

  await end.select();
  await expect(edge.feedbackLocator()).toBeHidden();
  await expect(edge.locator()).toBeVisible();
});

test('auto align', async ({ page, browserName }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const end = processEditor.endElement;

  await end.move({ x: 300, y: 300 });
  const startPos = await start.getPosition();
  const endPos = await end.getPosition();

  await processEditor.multiSelect([start, end], cmdCtrl(browserName));
  await processEditor.quickAction().trigger('Auto Align (A)');
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
  await processEditor.quickAction().trigger('Wrap', 'startsWith');
  await expect(start.locator()).toBeHidden();
  await expect(end.locator()).toBeHidden();
  await expect(embedded.locator()).toBeVisible();

  await embedded.quickActionBar().trigger('Jump', 'startsWith');
  await expect(start.locator()).toBeVisible();
  await expect(end.locator()).toBeVisible();
  await expect(embedded.locator()).toBeHidden();
  await jumpOutBtn.expectVisible();

  await processEditor.jumpOut().click();
  await expect(start.locator()).toBeHidden();
  await expect(end.locator()).toBeHidden();
  await expect(embedded.locator()).toBeVisible();

  await embedded.quickActionBar().trigger('Unwrap', 'startsWith');
  await expect(start.locator()).toBeVisible();
  await expect(end.locator()).toBeVisible();
  await expect(embedded.locator()).toBeHidden();
});
