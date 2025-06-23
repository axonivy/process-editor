import { expect, test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Reset tab', () => {
  test('reset button', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const general = inscriptionView.inscriptionTab('General');
    await general.open();

    const resetBtn = inscriptionView.reset();
    await expect(resetBtn).toBeHidden();
    const desc = general.textArea({ label: 'Description' });
    await desc.fill('bla');
    await expect(resetBtn).toBeVisible();

    const task = inscriptionView.inscriptionTab('Task');
    await task.open();

    const name = task.macroInput('Name');
    await name.fill('bli');

    await resetBtn.click();
    await name.expectValue('user task');

    await general.open();
    await desc.expectValue('test desc');
  });
});
