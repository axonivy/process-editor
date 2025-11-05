import { test } from '@playwright/test';
import { expectCodeInEditor } from '../../../page-objects/inscription/code-editor';
import { openMockInscription } from '../../../page-objects/inscription/inscription-view';
import { applyBrowser, assertCodeHidden, assertCodeVisible, code } from './browser-mock-utils';

test('browser add to input', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  const description = task.macroArea('Description');
  await assertCodeHidden(page);
  await description.activate();
  await assertCodeVisible(page);

  await applyBrowser(page, 'Attribute', 'in.bla', 2);
  await expectCodeInEditor(code(page), '<%=in.bla%>');
});

test('browser replace selection', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  const category = task.macroInput('Category');
  await assertCodeHidden(page);
  await category.activate();
  await assertCodeVisible(page);

  await page.keyboard.type('test 123 zag');
  await code(page).dblclick();

  await applyBrowser(page, 'Attribute', 'in.bla', 2);
  await expectCodeInEditor(code(page), 'test 123 <%=in.bla%>');
});

test('browser add attribute doubleclick', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  const description = task.macroArea('Description');
  await assertCodeHidden(page);
  await description.activate();
  await assertCodeVisible(page);

  await applyBrowser(page, 'Attribute', undefined, 2, true);
  await expectCodeInEditor(code(page), '<%=in.bla%>');
});
