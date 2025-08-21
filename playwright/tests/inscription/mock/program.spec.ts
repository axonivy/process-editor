import { test } from '@playwright/test';
import { openMockInscription } from '../../page-objects/inscription/inscription-view';

test.describe('ProgramInterface', () => {
  test('Widget variants', async ({ page }) => {
    const inscriptionView = await openMockInscription(page, { type: 'ProgramInterface' });
    const configs = inscriptionView.inscriptionTab('Configuration');
    await configs.open();

    const query = configs.macroArea('query');
    await query.expectValue('Help me, my computer is beeping with in.error .');

    const system = configs.macroInput('system');
    await system.expectValue('You are a polite and helpful Support Agent trying to achieve in.goal ');

    const returnType = configs.scriptInput('returnType');
    await returnType.expectValue('com.axonivy.utils.ai.SupportTicket.class');
  });
});
