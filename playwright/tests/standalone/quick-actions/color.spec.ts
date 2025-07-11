import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import { cmdCtrl } from '../../page-objects/editor/test-helper';

test('colorize node', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const element = processEditor.startElement;
  await element.expectColor();
  await element.quickActionBar().addColor();
  await element.expectColor('rgb(0, 0, 255)');
});

test('colorize connector', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const edge = processEditor.edge();
  await edge.expectColor();
  await edge.quickActionBar().addColor();
  await edge.expectColor('rgb(0, 0, 255)');
});

test('colorize lane', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const lane = await processEditor.createLane({ x: 10, y: 90 });
  await lane.expectColor();
  await lane.quickActionBar().addColor();
  await lane.expectColor('#0000ff');
});

test('colorize multiple elements', async ({ page, browserName }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const end = processEditor.endElement;
  await start.expectColor();
  await end.expectColor();

  await processEditor.multiSelect([start, end], cmdCtrl(browserName));
  await processEditor.quickAction().addColor();
  await start.expectColor('rgb(0, 0, 255)');
  await end.expectColor('rgb(0, 0, 255)');
});

test('add new and remove color', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;

  const quickAction = start.quickActionBar();
  const menu = quickAction.menu().locator();
  await quickAction.addColor();

  await quickAction.trigger('Select color');
  await expect(menu).toBeVisible();
  const newColor = menu.locator('.menu-item:has-text("TestColor")');
  await expect(newColor).toBeVisible();
  await newColor.locator('.color-edit-button').click();

  await expect(menu.locator('#input-Name')).toHaveValue('TestColor');
  await expect(menu.locator('#input-Color')).toHaveValue('#0000ff');
  await expect(menu.locator('input[type="color"]')).toHaveValue('#0000ff');
  await expect(menu.locator('.color-picker .decorator')).toHaveCSS('background-color', 'rgb(0, 0, 255)');

  await menu.locator('.edit-color-delete').click();
  await expect(menu).toBeHidden();
  await quickAction.trigger('Select color');
  await expect(newColor).toBeHidden();
});

test('validate color dialog inputs', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;

  const quickAction = start.quickActionBar();
  const menu = quickAction.menu().locator();
  await quickAction.trigger('Select color');
  await menu.locator('.menu-group-items .new-color-btn').click();
  await expect(menu).toBeVisible();

  const nameInput = menu.locator('#input-Name');
  const colorInput = menu.locator('#input-Color');
  const confirmBtn = menu.locator('.edit-color-save');

  await expect(nameInput).toBeEmpty();
  await expect(colorInput).toBeEmpty();
  await expect(nameInput).not.toHaveClass(/error/);
  await expect(colorInput).not.toHaveClass(/error/);

  await confirmBtn.click();
  await expect(menu).toBeVisible();
  await expect(nameInput).toHaveClass(/error/);
  await expect(colorInput).toHaveClass(/error/);

  nameInput.fill('bla');
  await confirmBtn.click();
  await expect(menu).toBeVisible();
  await expect(nameInput).not.toHaveClass(/error/);
  await expect(colorInput).toHaveClass(/error/);

  colorInput.fill('color');
  await confirmBtn.click();
  await expect(menu).toBeHidden();
});
