import { CollapsableUtil, customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { Statement } from './Statement';

describe('Statement', () => {
  test('data', async () => {
    customRender(<Statement />, {
      wrapperProps: { data: { config: { query: { sql: { stmt: 'test' } } } } }
    });
    await CollapsableUtil.assertOpen('Definition');
    expect(screen.getByRole('textbox')).toHaveValue('test');
  });
});
