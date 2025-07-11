import { CollapsableUtil, customRender, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import { Limit } from './Limit';

describe('Limit', () => {
  test('data', async () => {
    customRender(<Limit />, { wrapperProps: { data: { config: { query: { limit: '123', offset: '456' } } } } });
    await CollapsableUtil.assertOpen('Limit');
    expect(screen.getByLabelText('Lot size')).toHaveValue('123');
    expect(screen.getByLabelText('Start index')).toHaveValue('456');
  });
});
