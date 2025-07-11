import type { RestRequestData } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { CollapsableUtil, ComboboxUtil, customRender, screen, TableUtil, userEvent } from 'test-utils';
import { describe, test } from 'vitest';
import { RestProperties } from './RestProperties';

describe('RestProperties', () => {
  function renderPart(data?: DeepPartial<RestRequestData>) {
    customRender(<RestProperties />, {
      wrapperProps: { data: data && { config: data }, meta: { restProperties: ['username', 'rester', '132'] } }
    });
  }

  test('empty', async () => {
    renderPart();
    await CollapsableUtil.assertClosed('Properties');
  });

  test('data', async () => {
    renderPart({ target: { properties: { rester: 'value' } } });

    await CollapsableUtil.assertOpen('Properties');
    TableUtil.assertRows(['rester value']);
    await userEvent.click(screen.getByRole('row', { name: 'rester value' }));
    await ComboboxUtil.assertValue('rester');
    await ComboboxUtil.assertOptionsCount(3);
  });
});
