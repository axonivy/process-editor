import { ComboboxUtil, customRender } from 'test-utils';
import { describe, test } from 'vitest';
import { TableSelect } from './TableSelect';

describe('TableSelect', () => {
  test('data', async () => {
    customRender(<TableSelect />, {
      wrapperProps: { data: { config: { query: { sql: { table: 'test' } } } }, meta: { tables: ['ivy', 'test', 'db'] } }
    });
    await ComboboxUtil.assertValue('test');
    await ComboboxUtil.assertOptionsCount(3);
  });
});
