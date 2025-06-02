import ExpiryPart from './ExpiryPart';
import { customRender, screen, SelectUtil, userEvent } from 'test-utils';
import type { WfExpiry } from '@axonivy/process-editor-inscription-protocol';
import { describe, test, expect } from 'vitest';

describe('ExpiryPart', () => {
  function renderExpiryPart(data?: WfExpiry) {
    customRender(<ExpiryPart />, { wrapperProps: { data: data && { config: { task: { expiry: data } } } } });
  }

  test('expiry part only render empty timeout input', async () => {
    renderExpiryPart();
    const expiryCollapse = screen.getByRole('button', { name: /Expiry/ });
    await userEvent.click(expiryCollapse);

    expect(screen.getByLabelText('Timeout')).toHaveValue('');
    expect(screen.queryByText('Responsible')).not.toBeInTheDocument();
  });

  test('expiry part will render all', async () => {
    renderExpiryPart({
      timeout: 'timeout',
      error: 'f0',
      priority: { level: 'HIGH', script: '' },
      responsible: { type: 'ROLE_FROM_ATTRIBUTE', script: 'asdf', roles: [] }
    });
    expect(screen.getByLabelText('Timeout')).toHaveValue('timeout');
    await SelectUtil.assertValue('f0', { label: 'Error' });
    await SelectUtil.assertValue('Role from Attribute', { index: 1 });
    await SelectUtil.assertValue('High', { index: 2 });
  });
});
