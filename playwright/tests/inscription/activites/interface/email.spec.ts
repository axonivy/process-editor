import { test } from '@playwright/test';
import { copyInscriptionProcess, deleteInscriptionProcess } from '../../../create-random-process';
import { openElementInscription, type Inscription } from '../../../page-objects/inscription/inscription-view';
import { MailAttachmentTest } from '../../parts/mail-attachments';
import { MailContentTest } from '../../parts/mail-content';
import { MailErrorTest } from '../../parts/mail-error';
import { MailHeaderTest } from '../../parts/mail-header';
import { GeneralTest } from '../../parts/name';
import { runTest } from '../../parts/part-tester';

let processId: string;
let view: Inscription;

test.beforeEach(async ({ page }) => {
  processId = (await copyInscriptionProcess('192FC4D4F5911DE3')).processIdentifier.pid;
  view = await openElementInscription(page, processId + '-f3');
});

test.afterEach(async () => {
  await deleteInscriptionProcess(processId);
});

test('Header', async () => {
  await view.expectHeaderText('E-Mail');
});

test('General', async () => {
  await runTest(view, GeneralTest);
});

test('MailHeader', async () => {
  await runTest(view, MailHeaderTest);
});

test('MailError', async () => {
  await runTest(view, MailErrorTest);
});

test('MailContent', async () => {
  await runTest(view, MailContentTest);
});

test('MailAttachments', async () => {
  await runTest(view, MailAttachmentTest);
});
