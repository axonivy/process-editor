import { CollapsableUtil, SelectUtil, TableUtil, customRender } from 'test-utils';
import { describe, test } from 'vitest';
import { TableSort } from './TableSort';

describe('TableSort', () => {
  test('empty', async () => {
    customRender(<TableSort />);
    await CollapsableUtil.assertClosed('Sort');
  });

  test('data', async () => {
    customRender(<TableSort />, {
      wrapperProps: {
        data: { config: { query: { sql: { orderBy: ['test'] } } } },
        meta: {
          columns: [
            { name: 'test', type: 'VarChar(10)', ivyType: 'String' },
            { name: 'hi', type: 'bool', ivyType: 'Boolean' }
          ]
        }
      }
    });
    await CollapsableUtil.assertOpen('Sort');
    TableUtil.assertHeaders(['Column', 'Direction']);
    await SelectUtil.assertValue('test', { index: 0 });
    await SelectUtil.assertValue('ASCENDING', { index: 1 });
  });
});
