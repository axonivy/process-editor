import { expect, test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Reset part', () => {
  test('reset button', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const part = inscriptionView.inscriptionTab('General');
    await part.open();

    const resetBtn = part.reset();
    await expect(resetBtn).toBeDisabled();
    const name = part.textArea({ label: 'Display name' });
    await name.fill('bla');
    await expect(resetBtn).toBeVisible();

    await resetBtn.click();
    await name.expectValue('test name');
  });
});
