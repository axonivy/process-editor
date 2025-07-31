import { expect, test } from '@playwright/test';
import { ProcessEditor } from '../../page-objects/editor/process-editor';
import type { Inscription } from '../../page-objects/inscription/inscription-view';

test('elements', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const view = await processEditor.startElement.inscribe();
  await view.expectOpen();
  await view.expectHeaderText(/Start/);

  await processEditor.endElement.select();
  await view.expectHeaderText(/End/);

  await processEditor.resetSelection();
  await view.expectHeaderText(/Business Process/);
  await view.expectClosed();
});

test('undo', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const start = processEditor.startElement;
  const view = await start.inscribe();
  const resetBtn = view.reset();
  await expect(resetBtn).toBeHidden();
  await changeName(view, 'start', 'hello');
  await expect(resetBtn).toBeVisible();

  await processEditor.endElement.select();
  const { part, input } = await changeName(view, '', 'world');

  await resetBtn.click();
  await input.expectValue('');
  await start.select();
  await expect(resetBtn).toBeHidden();
  await part.open();
  await changeName(view, 'hello', 'start');
  await expect(resetBtn).toBeVisible();
  await resetBtn.click();
  await input.expectValue('hello');
});

test('ivyscript lsp', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const view = await processEditor.startElement.inscribe();
  const part = view.inscriptionTab('Start');
  await part.open();
  const section = part.section('Code');
  await section.open();
  const code = section.scriptArea();
  await code.triggerContentAssist();
  await code.expectContentAssistContains('ivy');
});

test('process', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const view = await processEditor.toggleInscription();
  await view.expectOpen();
  await view.expectHeaderText(/Business Process/);

  await processEditor.toggleInscription();
  await view.expectClosed();
});

test('hold inscriptionTab state', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const view = await processEditor.endElement.inscribe();
  const general = view.inscriptionTab('General');
  const task = view.inscriptionTab('Task');
  await general.expectOpen();

  await processEditor.startElement.select();
  await general.expectOpen();
  await task.expectClosed();
  await task.open();
  await general.expectClosed();

  await processEditor.endElement.select();
  await general.expectOpen();

  await processEditor.startElement.select();
  await general.expectClosed();
  await task.expectOpen();
});

test('web service auth link', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/ws.p.json', waitFor: '.sprotty-graph' });
  const wsStart = editor.element('start:webserviceStart');
  const view = await wsStart.inscribe();
  const wsPart = view.inscriptionTab('Web Service');
  await wsPart.open();
  await expect(wsPart.currentLocator().getByText('Web service authentication on the')).toBeVisible();
  const link = wsPart.currentLocator().locator('a', { hasText: 'process' });
  await expect(link).toBeVisible();
  await link.click();
  await wsStart.expectNotSelected();
  await view.expectHeaderText('Web Service Process');
});

async function changeName(view: Inscription, oldValue: string, value: string) {
  const part = view.inscriptionTab('General');
  await part.open();
  const section = part.section('Name / Description');
  await section.open();
  const input = section.textArea({ label: 'Display name' });
  await input.expectValue(oldValue);
  await input.fill(value);
  return { part, input };
}
