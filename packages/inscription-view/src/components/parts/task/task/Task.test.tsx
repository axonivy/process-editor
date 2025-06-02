import Task from './Task';
import type { WfTask } from '@axonivy/process-editor-inscription-protocol';
import { CollapsableUtil, customRender, screen, SelectUtil, userEvent } from 'test-utils';
import { describe, test, expect } from 'vitest';

describe('Task', () => {
  function renderTask(data?: Partial<WfTask>) {
    customRender(<Task />, { wrapperProps: { data: data && { config: { task: data } } } });
  }

  async function assertMainPart(name: string, description: string, category: string, responsible: string, priority: string, code?: string) {
    expect(screen.getByLabelText('Name')).toHaveValue(name);
    expect(screen.getByLabelText('Description')).toHaveValue(description);
    expect(screen.getByLabelText('Category')).toHaveValue(category);
    await SelectUtil.assertValue(responsible, { index: 0 });
    await SelectUtil.assertValue(priority, { index: 1 });

    if (code) {
      await CollapsableUtil.assertOpen('Code');
      expect(screen.getAllByTestId('code-editor').pop()).toHaveValue(code);
    } else {
      await CollapsableUtil.assertClosed('Code');
    }
  }

  test('task part render empty', async () => {
    renderTask();
    await CollapsableUtil.assertClosed('Details');
    await CollapsableUtil.assertClosed('Responsible');
    await CollapsableUtil.assertClosed('Priority');
    await CollapsableUtil.assertClosed('Options');
    await CollapsableUtil.assertClosed('Expiry');
    await CollapsableUtil.assertClosed('Custom Fields');
    await CollapsableUtil.assertClosed('Notification');
    await CollapsableUtil.assertClosed('Code');
  });

  test('task part render skip task list option', async () => {
    renderTask(undefined);
    const optionCollapse = screen.getByRole('button', { name: /Option/ });
    await userEvent.click(optionCollapse);

    expect(screen.getByText('Skip Tasklist')).toBeInTheDocument();
    expect(screen.getByText('Delay')).toBeInTheDocument();
    expect(screen.queryByText(/Persist/)).not.toBeInTheDocument();
  });

  test('task part render all', async () => {
    renderTask({
      name: 'task',
      description: 'desc',
      category: 'cat',
      responsible: { type: 'ROLE_FROM_ATTRIBUTE', script: 'bla', roles: [] },
      priority: { level: 'EXCEPTION', script: '' },
      skipTasklist: true,
      notification: { suppress: true, template: 'Default' },
      delay: 'delay',
      customFields: [{ name: 'cf', type: 'NUMBER', value: '123' }],
      code: 'code'
    });
    await assertMainPart('task', 'desc', 'cat', 'Role from Attribute', 'Exception', 'code');
  });
});
