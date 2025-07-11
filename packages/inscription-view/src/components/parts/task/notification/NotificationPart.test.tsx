import type { WfTask } from '@axonivy/process-editor-inscription-protocol';
import { SelectUtil, customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import NotificationPart from './NotificationPart';

describe('NotificationPart', () => {
  function renderTaskPart(data?: Partial<WfTask>) {
    customRender(<NotificationPart />, { wrapperProps: { data: data && { config: { task: data } } } });
  }

  test('empty', async () => {
    renderTaskPart();
    await userEvent.click(screen.getByRole('button', { name: /Notification/ }));
    expect(screen.getByLabelText('Suppress')).not.toBeChecked();
    await SelectUtil.assertValue('Default', { label: 'Template' });
  });

  test('configured', async () => {
    renderTaskPart({ notification: { suppress: true, template: 'Customer' } });
    expect(screen.getByLabelText('Suppress')).toBeChecked();
    await SelectUtil.assertValue('Customer', { label: 'Template' });
  });
});
