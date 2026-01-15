import { test } from '@playwright/test';
import { copyInscriptionProcess, deleteInscriptionProcess } from '../../../create-random-process';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { runTest } from '../../parts/part-tester';
import { RestRequestOpenApiTest } from '../../parts/rest-request';
import { RestRequestBodyOpenApiTest } from '../../parts/rest-request-body';

test.describe.configure({ mode: 'serial' });

let processId: string;
let view: Inscription;
test.beforeAll(async () => {
  processId = (await copyInscriptionProcess('192FC4D4F5911DE3')).processIdentifier.pid;
});

test.beforeEach(async ({ page }) => {
  view = await openElementInscription(page, processId + '-f2');
});

test.afterAll(async () => {
  await deleteInscriptionProcess(processId);
});

test('Request - OpenApi', async () => {
  await runTest(view, RestRequestOpenApiTest);
});

test('RequestBody - OpenApi', async () => {
  await runTest(view, RestRequestBodyOpenApiTest);
});
