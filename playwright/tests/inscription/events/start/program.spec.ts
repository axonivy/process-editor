import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { ConfigFilePickupStartEventBeanTest, ConfigTimerBeanTest } from '../../parts/configuration';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { ProgramStartTest } from '../../parts/program-start';

test.describe('Program Start', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('ProgramStart');
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Program Start');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Java Bean', async () => {
    await runTest(view, ProgramStartTest);
  });

  test('Configuration FilePickupBean', async () => {
    const start = view.inscriptionTab('Java Bean');
    await start.open();
    await start.section('Java Class').open();
    await start.combobox().choose('FilePickupStartEventBean');

    await runTest(view, ConfigFilePickupStartEventBeanTest);
  });

  test('Configuration TimerBean', async () => {
    const start = view.inscriptionTab('Java Bean');
    await start.open();
    await start.section('Java Class').open();
    await start.combobox().choose('TimerBean');
    await runTest(view, ConfigTimerBeanTest);
  });
});
