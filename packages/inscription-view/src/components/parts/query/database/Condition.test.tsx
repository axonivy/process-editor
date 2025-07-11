import { CollapsableUtil, customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { Condition } from './Condition';

describe('Condition', () => {
  test('data', async () => {
    customRender(<Condition />, {
      wrapperProps: { data: { config: { query: { sql: { condition: 'test' } } } } }
    });
    await CollapsableUtil.assertOpen('Condition');
    expect(screen.getByRole('textbox')).toHaveValue('test');
  });
});
