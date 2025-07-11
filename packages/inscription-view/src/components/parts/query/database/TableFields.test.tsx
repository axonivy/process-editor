import { CollapsableUtil, TableUtil, customRender, screen } from 'test-utils';
import { describe, test } from 'vitest';
import { TableFields } from './TableFields';

describe('TableFields', () => {
  const renderTable = async (fields: Record<string, string>) => {
    customRender(<TableFields />, {
      wrapperProps: {
        data: { config: { query: { sql: { fields } } } },
        meta: {
          columns: [
            { name: 'test', type: 'VarChar(10)', ivyType: 'String' },
            { name: 'hi', type: 'bool', ivyType: 'Boolean' }
          ]
        }
      }
    });
  };

  test('data', async () => {
    await renderTable({ test: 'bla' });
    await CollapsableUtil.assertOpen('Fields');
    TableUtil.assertHeaders(['Column', 'Value']);
    await screen.findByText('hi');
    await TableUtil.assertRowCount(3);
    TableUtil.assertRows(['test : VarChar(10) bla', 'hi : bool']);
  });

  test('unknown columns', async () => {
    await renderTable({ unknown: '1234' });
    await CollapsableUtil.assertOpen('Fields');
    TableUtil.assertHeaders(['Column', 'Value']);
    await screen.findByText('hi');
    await screen.findByDisplayValue('1234');
    await TableUtil.assertRowCount(4);
    TableUtil.assertRows(['test : VarChar(10)', 'hi : bool', 'unknown : 1234']);
  });
});
