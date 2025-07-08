import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('switch tool', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const toolbar = processEditor.toolbar();
  await toolbar.triggerDefault();
  await toolbar.triggerMarquee();
  await toolbar.triggerDefault();
});

test('undo / redo', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const undo = processEditor.toolbar().undoButton();
  const redo = processEditor.toolbar().redoButton();
  const start = processEditor.startElement;
  await expect(start.locator()).toBeVisible();
  await expect(undo).toBeDisabled();
  await expect(redo).toBeDisabled();

  await start.delete();
  await expect(start.locator()).toBeHidden();
  await expect(undo).toBeEnabled();
  await expect(redo).toBeDisabled();

  await undo.click();
  await expect(start.locator()).toBeVisible();
  await expect(undo).toBeDisabled();
  await expect(redo).toBeEnabled();

  await redo.click();
  await expect(start.locator()).toBeHidden();
  await expect(undo).toBeEnabled();
  await expect(redo).toBeDisabled();
});

test('undo / redo with inscription', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const undo = processEditor.toolbar().undoButton();
  const redo = processEditor.toolbar().redoButton();
  const start = processEditor.startElement;
  const inscription = await start.inscribe();
  const name = inscription.inscriptionTab('General').section('Name / Description').textArea({ label: 'Display Name' });
  await name.expectValue('start');
  await expect(undo).toBeDisabled();
  await expect(redo).toBeDisabled();

  await name.fill('Test');
  await start.expectLabel('Test');
  await expect(undo).toBeEnabled();
  await expect(redo).toBeDisabled();

  await undo.click();
  await start.expectLabel('start');
  await name.expectValue('start');
  await expect(undo).toBeDisabled();
  await expect(redo).toBeEnabled();

  await processEditor.resetSelection();
  await inscription.expectClosed();

  await redo.click();
  await expect(processEditor.toast).toContainText('Redo configuration');
  await processEditor.toast.getByRole('button', { name: 'Open element' }).click();
  await inscription.expectOpen();
  await start.expectLabel('Test');
  await name.expectValue('Test');
  await expect(undo).toBeEnabled();
  await expect(redo).toBeDisabled();
});

test('search', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const menu = await processEditor.toolbar().openElementPalette('all_elements');
  await menu.expectMenuGroupCount(9);

  await menu.search('ta');
  await menu.expectMenuGroupCount(5);
  await menu.expectMenuItemCount(8);

  await menu.search('bla');
  await menu.expectMenuGroupCount(0);
  await menu.expectMenuItemCount(0);
  await expect(menu.emptyResult()).toBeVisible();
  await expect(menu.emptyResult()).toHaveText('No results found.');

  await page.keyboard.press('Escape');
  await expect(menu.searchInput()).toBeEmpty();
  await menu.expectMenuGroupCount(9);
});

test('ghost element', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const userTask = processEditor.element('userTask');
  await expect(page.locator('.ghost-element')).toBeHidden();
  await processEditor.toolbar().triggerCreateElement('activities', 'User Task');
  await page.mouse.move(300, 300);
  await expect(userTask.locator()).toBeVisible();
  await expect(userTask.locator()).toHaveClass(/ghost-element/);
});

test('cancel element creation', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  await expect(processEditor.diagram).not.toHaveClass(/node-creation-mode/);
  await processEditor.toolbar().triggerCreateElement('activities', 'User Task');
  await page.mouse.move(300, 300);
  await expect(processEditor.diagram).toHaveClass(/node-creation-mode/);
  await page.keyboard.press('Escape');
  await expect(processEditor.diagram).not.toHaveClass(/node-creation-mode/);
});
