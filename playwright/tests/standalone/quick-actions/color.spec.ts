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

  await expect(menu).toBeVisible();
  const newColor = menu.locator('.ui-palette-item:has-text("TestColor")');
  await expect(newColor).toBeVisible();
  await newColor.locator('[data-function=edit-color]').click();

  const editUi = menu.locator('.edit-color');
  await expect(editUi).toBeVisible();
  await expect(editUi.locator('#color-name-input')).toHaveValue('TestColor');
  await expect(editUi.locator('#color-input')).toHaveValue('#0000ff');
  await expect(editUi.locator('input[type="color"]')).toHaveValue('#0000ff');
  await expect(editUi.locator('.color-picker .decorator')).toHaveCSS('background-color', 'rgb(0, 0, 255)');

  await editUi.locator('.edit-color-delete').click();
  await expect(editUi).toBeHidden();
  await expect(menu).toBeVisible();
  await expect(quickAction.locator()).toBeVisible();
  await quickAction.trigger('Select color');
  await expect(quickAction.locator()).toBeVisible();
});

test('validate color dialog inputs', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;

  const quickAction = start.quickActionBar();
  const menu = quickAction.menu().locator();
  await quickAction.trigger('Select color');
  await menu.locator('.ui-palette-section .new-color').click();

  const editUi = menu.locator('.edit-color');
  await expect(editUi).toBeVisible();

  const nameInput = editUi.locator('#color-name-input');
  const colorInput = editUi.locator('#color-input');
  const confirmBtn = editUi.locator('.edit-color-save');

  await expect(nameInput).toBeEmpty();
  await expect(colorInput).toHaveValue('#000000');
  await expect(editUi.locator('#color-name-input:invalid')).toBeVisible();
  await expect(editUi.locator('#color-input:valid')).toBeVisible();
  await expect(confirmBtn).toBeDisabled();

  nameInput.fill('bla');
  await expect(editUi).toBeVisible();
  await expect(editUi.locator('#color-name-input:valid')).toBeVisible();
  await expect(editUi.locator('#color-input:valid')).toBeVisible();
  await expect(confirmBtn).toBeEnabled();

  colorInput.fill('color');
  await confirmBtn.click();
  await expect(editUi).toBeHidden();
  await expect(menu).toBeVisible();
  await expect(quickAction.locator()).toBeVisible();
});
