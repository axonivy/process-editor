import { test } from '@playwright/test';
import { openElementInscription, type Inscription } from '../../page-objects/inscription/inscription-view';
import type { CreateProcessResult } from '../../glsp-protocol';
import { createProcess } from '../../glsp-protocol';

test.describe('Code Editor', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('UserTask');
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.elementId);
  });

  test('MacroInput', async () => {
    const taskPart = view.inscriptionTab('Task');
    await taskPart.open();
    const details = taskPart.section('Name / Description');
    await details.open();
    const name = details.macroInput('Name');
    await name.triggerContentAssist();
    await name.expectContentAssistContains('Insert Macro');
  });

  test('MacroArea', async () => {
    const taskPart = view.inscriptionTab('Task');
    await taskPart.open();
    const details = taskPart.section('Name / Description');
    await details.open();
    const description = details.macroArea('Description');
    await description.triggerContentAssist();
    await description.expectContentAssistContains('Insert Macro');
  });

  test('ScriptArea', async () => {
    const taskPart = view.inscriptionTab('Task');
    await taskPart.open();
    const codeSection = taskPart.section('Code');
    await codeSection.toggle();
    const code = codeSection.scriptArea();
    await code.triggerContentAssist();
    await code.expectContentAssistContains('in');
  });

  test('ScriptInput', async () => {
    const taskPart = view.inscriptionTab('Task');
    await taskPart.open();
    const expirySection = taskPart.section('Expiry');
    await expirySection.toggle();
    const timeout = expirySection.scriptInput('Timeout');
    await timeout.triggerContentAssist();
    await timeout.expectContentAssistContains('in');
  });
});
