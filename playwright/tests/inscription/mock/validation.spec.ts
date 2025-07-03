import { expect, test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('Validations', () => {
  const normalColor = 'rgb(231, 231, 231)';
  const errorColor = 'rgb(229, 21, 28)';
  const warningColor = 'rgb(255, 115, 0)';

  test('case', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const part = inscriptionView.inscriptionTab('Case');
    const section = part.section('Name / Description');
    const name = section.macroInput('Name');
    const desc = section.macroArea('Description');

    await part.open();
    await section.open();
    await expect(name.locator).toHaveCSS('border-color', normalColor);
    await expect(desc.locator).toHaveCSS('border-color', normalColor);

    await name.clear();
    await desc.clear();
    await expect(name.locator).toHaveCSS('border-color', errorColor);
    await expect(desc.locator).toHaveCSS('border-color', warningColor);
  });

  test('dialog', async ({ page }) => {
    const inscriptionView = await openMockInscription(page);
    const part = inscriptionView.inscriptionTab('Dialog');
    const dialogSection = part.section('Dialog');
    const mappingSection = part.section('Mapping');
    const dialog = dialogSection.combobox();
    const mapping = mappingSection.table(['text', 'expression']);

    await part.open();
    await dialogSection.open();
    await mappingSection.open();
    await expect(dialog.locator).toHaveCSS('border-color', warningColor);
    await expect(mapping.row(1).locator).toHaveCSS('border-color', warningColor);

    await dialog.fill('bla');
    await expect(dialog.locator).toHaveCSS('border-color', normalColor);
  });
});
