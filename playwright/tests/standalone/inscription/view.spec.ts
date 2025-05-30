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
  await changeName(view, 'start', 'hello');

  await processEditor.endElement.select();
  const { part, input } = await changeName(view, '', 'world');

  await part.reset().click();
  await input.expectValue('');

  await start.select();
  await part.open();
  await part.reset().click();
  await input.expectValue('start');
});

test('ivyscript lsp', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const view = await processEditor.startElement.inscribe();
  const part = view.accordion('Start');
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

test('hold accordion state', async ({ page }) => {
  const processEditor = await ProcessEditor.openProcess(page);
  const view = await processEditor.endElement.inscribe();
  const general = view.accordion('General');
  const task = view.accordion('Task');
  await general.expectClosed();
  await general.open();
  await general.expectOpen();

  await processEditor.startElement.select();
  await general.expectOpen();
  await task.expectClosed();
  await task.open();
  await general.expectClosed();
  await task.expectOpen();

  await processEditor.endElement.select();
  await general.expectClosed();

  await processEditor.startElement.select();
  await general.expectClosed();
  await task.expectOpen();
});

test('web service auth link', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: '/processes/screenshot/ws.p.json', waitFor: '.sprotty-graph' });
  const wsStart = editor.element('start:webserviceStart');
  const view = await wsStart.inscribe();
  const wsPart = view.accordion('Web Service');
  await wsPart.open();
  await expect(wsPart.currentLocator().getByText('Web service authentication on the')).toBeVisible();
  const link = wsPart.currentLocator().locator('a', { hasText: 'process' });
  await expect(link).toBeVisible();
  await link.click();
  await wsStart.expectNotSelected();
  await view.expectHeaderText('Web Service Process');
});

async function changeName(view: Inscription, oldValue: string, value: string) {
  const part = view.accordion('General');
  await part.open();
  const section = part.section('Name / Description');
  await section.open();
  const input = section.textArea({ label: 'Display name' });
  await input.expectValue(oldValue);
  await input.fill(value);
  return { part, input };
}
