import { expect, test } from '@playwright/test';
import type { BaseElement } from '../../page-objects/editor/element';
import { ProcessEditor } from '../../page-objects/editor/process-editor';

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
});

test('starts', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/start.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('start:requestStart'), 'start-request');
  await screenshot(editor.element('start:signalStartEvent'), 'start-signal');
  await screenshot(editor.element('start:programStart'), 'start-program');
  await screenshot(editor.element('start:errorStartEvent'), 'start-error');
});

test('intermediate', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/intermediate.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('intermediate:taskSwitchEvent'), 'intermediate-task');
  await screenshot(editor.element('intermediate:waitEvent'), 'intermediate-wait');
});

test('end', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/end.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('end:taskEnd'), 'end-task');
  await screenshot(editor.element('end:taskEndPage'), 'end-page');
  await screenshot(editor.element('end:errorEnd'), 'end-error');
});

test('boundary', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/boundary.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('userTask'), 'boundary-signal', 0);
  await screenshot(editor.element('userTask'), 'boundary-error', 1);
});

test('gateway', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/gateway.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('alternative'), 'gateway-alternative');
  await screenshot(editor.element('split'), 'gateway-split');
  await screenshot(editor.element('join'), 'gateway-join');
  await screenshot(editor.element('taskSwitchGateway'), 'gateway-task-switch');
});

test('workflow', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/workflow.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('userTask'), 'user-task');
  await screenshot(editor.element('dialogCall'), 'dialog-call');
  await screenshot(editor.element('script'), 'script');
  await screenshot(editor.element('embeddedProcessElement'), 'embedded-sub');
  await screenshot(editor.element('subProcessCall'), 'call-sub');
  await screenshot(editor.element('triggerCall'), 'trigger');
});

test('interface', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/interface.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('database'), 'database');
  await screenshot(editor.element('webServiceCall'), 'webservice');
  await screenshot(editor.element('restClientCall'), 'restclient');
  await screenshot(editor.element('eMail'), 'mail');
  await screenshot(editor.element('programInterface'), 'program-interface');
});

test('bpmn', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/bpmn.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('genericBpmnElement'), 'bpmn-generic');
  await screenshot(editor.element('userBpmnElement'), 'bpmn-user');
  await screenshot(editor.element('manualBpmnElement'), 'bpmn-manual');
  await screenshot(editor.element('scriptBpmnElement'), 'bpmn-script');
  await screenshot(editor.element('serviceBpmnElement'), 'bpmn-service');
  await screenshot(editor.element('ruleBpmnElement'), 'bpmn-rule');
  await screenshot(editor.element('sendBpmnElement'), 'bpmn-send');
  await screenshot(editor.element('receiveBpmnElement'), 'bpmn-receive');
});

test('sub', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/sub.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('start:callSubStart'), 'call-sub-start');
  await screenshot(editor.element('end:callSubEnd'), 'call-sub-end');
});

test('ws', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/ws.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('start:webserviceStart'), 'ws-start');
  await screenshot(editor.element('end:webserviceEnd'), 'ws-end');
});

test('hd', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'src_hd/process/test/project/screenshot/hd/hdProcess.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('start:htmlDialogStart'), 'hd-init-start');
  await screenshot(editor.element('start:htmlDialogEventStart'), 'hd-event-start');
  await screenshot(editor.element('start:htmlDialogMethodStart'), 'hd-method-start');
  await screenshot(editor.element('end:htmlDialogEnd'), 'hd-end');
  await screenshot(editor.element('end:htmlDialogExit'), 'hd-exit-end');
});

test('note', async ({ page }) => {
  const editor = await ProcessEditor.openProcess(page, { file: 'processes/screenshot/note.p.json', waitFor: '.sprotty-graph' });
  await screenshot(editor.element('processAnnotation'), 'annotation');
});

async function screenshot(element: BaseElement, name: string, nth?: number) {
  const dir = process.env.SCREENSHOT_DIR ?? './target';
  const buffer = await element
    .locator()
    .nth(nth ?? 0)
    .screenshot({ path: `${dir}/screenshots/elements/${name}.png`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(500);
}
