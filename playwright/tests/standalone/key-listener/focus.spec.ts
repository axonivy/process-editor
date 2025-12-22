import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test('focus jumps', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  await page.keyboard.press('1');
  await expect(editor.toolbar().defaultTool).toBeFocused();
  await page.keyboard.press('2');
  await expect(editor.diagram).toBeFocused();
  await editor.startElement.expectSelected();
  await page.keyboard.press('Enter');
  await editor.inscription().expectOpen();
  await expect(editor.inscription().inscriptionTab('General').tabButtonLocator).not.toBeFocused();
  await page.keyboard.press('3');
  await expect(editor.inscription().inscriptionTab('General').tabButtonLocator).toBeFocused();
});

test('focus jumps not work in input fields', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page);
  const inscription = await editor.startElement.inscribe();
  const startTab = inscription.inscriptionTab('Start');
  await startTab.open();
  const codeSection = startTab.section('Code');
  await codeSection.open();
  const monaco = codeSection.scriptArea();
  await monaco.activate();
  await monaco.expectCodeFocused();
  await page.keyboard.press('3');
  await monaco.expectCodeFocused();
  await expect(editor.inscription().inscriptionTab('General').tabButtonLocator).not.toBeFocused();

  const signature = startTab.section('Signature').textArea().locator;
  await signature.focus();
  await page.keyboard.press('1');
  await expect(signature).toBeFocused();
  await expect(editor.toolbar().defaultTool).not.toBeFocused();
});
