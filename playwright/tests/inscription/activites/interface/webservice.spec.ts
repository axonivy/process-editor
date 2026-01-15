import { test } from '@playwright/test';
import { copyInscriptionProcess, deleteInscriptionProcess } from '../../../create-random-process';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { DataCacheTest } from '../../parts/db-cache';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { WsErrorTest } from '../../parts/ws-error';
import { WsOutputTest } from '../../parts/ws-output';
import { WsRequestTest } from '../../parts/ws-request';

let processId: string;
let view: Inscription;

test.beforeEach(async ({ page }) => {
  processId = (await copyInscriptionProcess('192FC4D4F5911DE3')).processIdentifier.pid;
  console.log('Process ID:', processId);
  view = await openElementInscription(page, processId + '-f1');
});

test.afterEach(async () => {
  await deleteInscriptionProcess(processId);
});

test('Header', async () => {
  await view.expectHeaderText('Web Service');
});

test('General', async () => {
  await runTest(view, GeneralTest);
});

test('Request', async () => {
  await runTest(view, WsRequestTest);
});

test('Cache', async () => {
  await runTest(view, DataCacheTest);
});

test('Error', async () => {
  await runTest(view, WsErrorTest);
});

test('Output', async () => {
  await runTest(view, WsOutputTest);
});
