import { test } from '@playwright/test';
import { copyInscriptionProcess, deleteInscriptionProcess } from '../../../create-random-process';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { runTest } from '../../parts/part-tester';
import { RestRequestOpenApiTest } from '../../parts/rest-request';
import { RestRequestBodyOpenApiTest } from '../../parts/rest-request-body';

let processId: string;
let view: Inscription;

test.beforeEach(async ({ page }) => {
  processId = (await copyInscriptionProcess('192FC4D4F5911DE3')).processIdentifier.pid;
  view = await openElementInscription(page, processId + '-f2');
});

test.afterEach(async () => {
  await deleteInscriptionProcess(processId);
});

test('Request - OpenApi', async () => {
  await runTest(view, RestRequestOpenApiTest);
});

test('RequestBody - OpenApi', async () => {
  await runTest(view, RestRequestBodyOpenApiTest);
});
