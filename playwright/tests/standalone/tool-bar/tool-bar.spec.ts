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
  const start = processEditor.startElement;
  await expect(start.locator()).toBeVisible();

  await start.delete();
  await expect(start.locator()).toBeHidden();

  await processEditor.toolbar().triggerUndo();
  await expect(start.locator()).toBeVisible();

  await processEditor.toolbar().triggerRedo();
  await expect(start.locator()).toBeHidden();
});

test('undo / redo with inscription', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const inscription = await start.inscribe();
  const accordion = inscription.accordion('General');
  await accordion.open();
  const section = accordion.section('Name / Description');
  await section.open();
  const name = section.textArea({ label: 'Display Name' });
  await name.expectValue('start');

  await name.fill('Test');
  // Trigger update (as memory process do not automatically update)
  await start.locator().click();
  await page.keyboard.press('ArrowDown');
  await start.expectLabel('Test');

  await processEditor.toolbar().triggerUndo();
  await start.expectLabel('start');
  await name.expectValue('start');

  await processEditor.toolbar().triggerRedo();
  await start.expectLabel('Test');
  await name.expectValue('Test');
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
