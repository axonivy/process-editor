import type { ScriptMappings } from '@axonivy/process-editor-inscription-protocol';
import { ComboboxUtil, customRender, screen, TableUtil, userEvent } from 'test-utils';
import { describe, test } from 'vitest';
import { PropertyTable } from './PropertyTable';

describe('PropertyTable', () => {
  function renderPart(data: ScriptMappings, hide?: string[]) {
    customRender(
      <PropertyTable
        properties={data}
        update={() => {}}
        knownProperties={['Super', 'soaper', '132']}
        hideProperties={hide}
        label='Properties'
        defaultOpen={true}
      />
    );
  }

  test('properties', async () => {
    renderPart({ soaper: 'value', test: 'bla' });
    TableUtil.assertRows(['soaper value', 'test bla']);
  });

  test('hide', async () => {
    renderPart({ soaper: 'value', test: 'bla' }, ['test']);
    TableUtil.assertRows(['soaper value']);
  });

  test('knownProperties', async () => {
    renderPart({ soaper: 'value' });
    await userEvent.click(screen.getByRole('row', { name: 'soaper value' }));
    await ComboboxUtil.assertValue('soaper');
    await ComboboxUtil.assertOptionsCount(3);
  });
});
