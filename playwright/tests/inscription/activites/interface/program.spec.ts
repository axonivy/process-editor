import { test } from '@playwright/test';
import type { CreateProcessResult } from '../../../glsp-protocol';
import { createProcess } from '../../../glsp-protocol';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { ProgramInterfaceErrorTest } from '../../parts/program-interface-error';
import { ProgramInterfaceStartTest } from '../../parts/program-interface-start';

test.describe('Program', () => {
  let view: Inscription;
  let testee: CreateProcessResult;

  test.beforeAll(async () => {
    testee = await createProcess('ProgramInterface');
  });

  test.beforeEach(async ({ page }) => {
    view = await openElementInscription(page, testee.elementId);
  });

  test('Header', async () => {
    await view.expectHeaderText('Program');
  });

  test('General', async () => {
    await runTest(view, GeneralTest);
  });

  test('Java Bean', async () => {
    await runTest(view, ProgramInterfaceStartTest);
  });

  test('Error', async () => {
    await runTest(view, ProgramInterfaceErrorTest);
  });

  test('Configuration', async () => {
    const start = view.inscriptionTab('Java Bean');
    await start.open();
    await start.section('Java Class').open();
    await start.combobox().choose('com.axonivy.wf.custom.ErpLoader');

    const config = view.inscriptionTab('Configuration');
    await config.open();

    const multi = config.multiSelect();
    await multi.choose('CSV');
    await multi.choose('XLS');
    await multi.expectValue('CSV,XLS');

    await multi.expectChipItem('CSV', { emoji: '🪪️', description: 'stable plain text' });
  });
});
