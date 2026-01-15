import { test } from '@playwright/test';
import { copyInscriptionProcess, deleteInscriptionProcess } from '../../create-random-process';
import { openElementInscription } from '../../page-objects/inscription/inscription-view';
import { GeneralTestWithoutTags } from '../parts/name';
import { runTest } from '../parts/part-tester';

let processId: string;
test.beforeAll(async () => {
  processId = (await copyInscriptionProcess('192FC4D84018CBE2')).processIdentifier.pid;
});

test.afterAll(async () => {
  await deleteInscriptionProcess(processId);
});

test('Generic', async ({ page }) => {
  const view = await openElementInscription(page, `${processId}-S10`);
  await view.expectHeaderText('Generic');
  await runTest(view, GeneralTestWithoutTags);
});

test('User', async ({ page }) => {
  const view = await openElementInscription(page, `${processId}-S20`);
  await view.expectHeaderText('User');
});

test('Manual', async ({ page }) => {
  const view = await openElementInscription(page, `${processId}-S30`);
  await view.expectHeaderText('Manual');
});

test('Script', async ({ page }) => {
  const view = await openElementInscription(page, `${processId}-S40`);
  await view.expectHeaderText('Script');
});

test('Service', async ({ page }) => {
  const view = await openElementInscription(page, `${processId}-S50`);
  await view.expectHeaderText('Service');
});

test('Rule', async ({ page }) => {
  const view = await openElementInscription(page, `${processId}-S60`);
  await view.expectHeaderText('Rule');
});

test('Receive', async ({ page }) => {
  const view = await openElementInscription(page, `${processId}-S80`);
  await view.expectHeaderText('Receive');
});

test('Send', async ({ page }) => {
  const view = await openElementInscription(page, `${processId}-S70`);
  await view.expectHeaderText('Send');
});
