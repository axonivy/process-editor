import { test } from '@playwright/test';
import { copyInscriptionProcess, deleteInscriptionProcess } from '../../../create-random-process';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';
import { RestErrorTest } from '../../parts/rest-error';
import { RestOutputTest } from '../../parts/rest-output';
import { RestRequestTest } from '../../parts/rest-request';
import { RestRequestBodyEntityTest, RestRequestBodyFormTest, RestRequestBodyJaxRsTest, RestRequestBodyRawTest } from '../../parts/rest-request-body';

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

test('Header', async () => {
  await view.expectHeaderText('Rest Client');
});

test('General', async () => {
  await runTest(view, GeneralTest);
});

test('Request', async () => {
  await runTest(view, RestRequestTest);
});

test('RequestBody - Entity', async () => {
  await runTest(view, RestRequestBodyEntityTest);
});

test('RequestBody - Form', async () => {
  await runTest(view, RestRequestBodyFormTest);
});

test('RequestBody - Raw', async () => {
  await runTest(view, RestRequestBodyRawTest);
});

test('RequestBody - JaxRs', async () => {
  await runTest(view, RestRequestBodyJaxRsTest);
});

test('Error', async () => {
  await runTest(view, RestErrorTest);
});

test('Output', async () => {
  await runTest(view, RestOutputTest);
});
