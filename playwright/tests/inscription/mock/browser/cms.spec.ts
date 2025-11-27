import { test } from '@playwright/test';
import { expectCodeInEditor } from '../../../page-objects/inscription/code-editor';
import { openMockInscription } from '../../../page-objects/inscription/inscription-view';
import { applyBrowser, assertCodeHidden, assertCodeVisible, code } from './browser-mock-utils';

test('browser add cms string', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  const description = task.macroArea('Description');
  await assertCodeHidden(page);
  await description.activate();
  await assertCodeVisible(page);

  await applyBrowser(page, 'CMS', 'ivy.cms.co("/hallo")en: hello', 2);
  await expectCodeInEditor(code(page), '<%=ivy.cms.co("/hallo")%>');
});

test('browser add cms file', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  const description = task.macroArea('Description');
  await assertCodeHidden(page);
  await description.activate();
  await assertCodeVisible(page);

  await applyBrowser(page, 'CMS', 'ivy.cms.cr("/BlaFile")', 1);
  await expectCodeInEditor(code(page), '<%=ivy.cms.cr("/BlaFile")%>');
});

test('browser add cms doubleclick', async ({ page }) => {
  const inscriptionView = await openMockInscription(page);
  const task = inscriptionView.inscriptionTab('Task');
  await task.open();

  const description = task.macroArea('Description');
  await assertCodeHidden(page);
  await description.activate();
  await assertCodeVisible(page);

  await applyBrowser(page, 'CMS', undefined, 2, true);
  await expectCodeInEditor(code(page), '<%=ivy.cms.co("/hallo")%>');
});
