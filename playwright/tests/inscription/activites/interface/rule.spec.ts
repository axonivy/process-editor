import { test } from '@playwright/test';
import { copyInscriptionProcess, deleteInscriptionProcess } from '../../../create-random-process';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { ProgramInterfaceErrorTest } from '../../parts/program-interface-error';

let processId: string;
let view: Inscription;

test.beforeEach(async ({ page }) => {
  processId = (await copyInscriptionProcess('192FC4D4F5911DE3')).processIdentifier.pid;
  view = await openElementInscription(page, processId + '-f4');
});

test.afterEach(async () => {
  await deleteInscriptionProcess(processId);
});

test('Header', async () => {
  await view.expectHeaderText('Rule');
});

test('General', async () => {
  await runTest(view, GeneralTest);
});

test('Error', async () => {
  await runTest(view, ProgramInterfaceErrorTest);
});
