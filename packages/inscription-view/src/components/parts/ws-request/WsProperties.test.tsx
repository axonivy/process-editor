import type { WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, ComboboxUtil, customRender, screen, TableUtil, userEvent } from 'test-utils';
import { describe, test } from 'vitest';
import { WsProperties } from './WsProperties';

describe('WsProperties', () => {
  function renderPart(data?: DeepPartial<WsRequestData>) {
    customRender(<WsProperties />, {
      wrapperProps: { data: data && { config: data }, meta: { wsProperties: ['Super', 'soaper', '132'] } }
    });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Properties');
  });

  test('data', async () => {
    renderPart({ properties: { soaper: 'value' } });
    await CollapsableUtil.assertOpen('Properties');
    TableUtil.assertRows(['soaper value']);
    await userEvent.click(screen.getByRole('row', { name: 'soaper value' }));
    await ComboboxUtil.assertValue('soaper');
    await ComboboxUtil.assertOptionsCount(3);
  });
});
