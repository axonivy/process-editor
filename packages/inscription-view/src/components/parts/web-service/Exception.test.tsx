import { CollapsableUtil, customRender, screen } from 'test-utils';
import { Exception } from './Exception';
import { describe, test, expect } from 'vitest';

describe('Exception', () => {
  test('data', async () => {
    customRender(<Exception />, {
      wrapperProps: { data: { config: { exception: { enabled: false, condition: '0===0', message: 'hallo' } } } }
    });
    await CollapsableUtil.assertOpen('Exception');
    expect(screen.getByLabelText('Use exception handling')).not.toBeChecked();
    expect(screen.getByLabelText('Condition')).toHaveValue('0===0');
    expect(screen.getByLabelText('Message')).toHaveValue('hallo');
  });

  test('closed if empty', async () => {
    customRender(<Exception />);
    await CollapsableUtil.assertClosed('Exception');
  });
});
