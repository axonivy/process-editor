import { test } from '@playwright/test';
import { copyInscriptionProcess, deleteInscriptionProcess } from '../../../create-random-process';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { DataCacheTest } from '../../parts/db-cache';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { WsErrorTest } from '../../parts/ws-error';
import { WsOutputTest } from '../../parts/ws-output';
import { WsRequestTest } from '../../parts/ws-request';

test.describe.configure({ mode: 'serial' });

let processId: string;
let view: Inscription;
test.beforeAll(async () => {
  processId = (await copyInscriptionProcess('192FC4D4F5911DE3')).processIdentifier.pid;
});

test.beforeEach(async ({ page }) => {
  view = await openElementInscription(page, processId + '-f1');
});

test.afterAll(async () => {
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
