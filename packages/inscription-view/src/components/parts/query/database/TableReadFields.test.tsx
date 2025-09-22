import { CollapsableUtil, TableUtil, customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { TableReadFields } from './TableReadFields';

describe('TableReadFields', () => {
  test('all', async () => {
    customRender(<TableReadFields />);
    await CollapsableUtil.assertClosed('Fields');
    await CollapsableUtil.toggle('Fields');
    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  test('data', async () => {
    customRender(<TableReadFields />, {
      wrapperProps: {
        data: { config: { query: { sql: { select: ['test'] } } } },
        meta: {
          columns: [
            { name: 'test', type: 'VarChar(10)', ivyType: 'String' },
            { name: 'hi', type: 'bool', ivyType: 'Boolean' }
          ]
        }
      }
    });
    await CollapsableUtil.assertOpen('Fields');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    TableUtil.assertHeaders(['Column', 'Read']);
    await screen.findByText(': VarChar(10)');
    TableUtil.assertRows(['test: VarChar(10) ✅', 'hi: bool']);
  });
});
