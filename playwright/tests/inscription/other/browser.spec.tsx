import { expect, test } from '@playwright/test';
import { openElementInscription } from '../../page-objects/inscription/inscription-view';

const SCRIPT_PID = '168F0C6DF682858E-f3';

test('Type browser search and search all types', async ({ page }) => {
  const view = await openElementInscription(page, SCRIPT_PID);
  const tab = view.inscriptionTab('Output');
  await tab.open();
  const section = tab.section('Code');
  await section.open();

  const browser = await section.scriptArea().openBrowsers();
  await browser.openTab('Type');

  await browser.search('Per');
  const personRow = browser.table.getByRole('row', { name: 'Person :' }).first();
  await expect(personRow).toBeVisible();
  await personRow.click();
  await expect(browser.help).toContainText('registered webshop user');

  const allTypes = browser.dialog.getByLabel('Search over all types');
  await allTypes.click();
  await expect(allTypes).toBeChecked();
  await expect(personRow).toBeVisible();

  await browser.search('does-not-exist');
  await expect(browser.table.getByRole('row')).toContainText('No type found, enter a fitting search term');
});
