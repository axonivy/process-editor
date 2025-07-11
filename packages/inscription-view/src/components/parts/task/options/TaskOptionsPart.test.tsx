import type { WfTask } from '@axonivy/process-editor-inscription-protocol';
import { customRender, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import TaskOptionsPart from './TaskOptionsPart';

describe('TaskOptionsPart', () => {
  function renderTaskPart(data?: Partial<WfTask>) {
    customRender(<TaskOptionsPart />, { wrapperProps: { data: data && { config: { task: data } } } });
  }

  test('empty', async () => {
    renderTaskPart();
    await userEvent.click(screen.getByRole('button', { name: /Option/ }));

    expect(screen.getByLabelText('Skip Tasklist')).not.toBeChecked();
    expect(screen.getByLabelText('Delay')).toHaveValue('');
  });

  test('configured', async () => {
    renderTaskPart({ skipTasklist: true, delay: 'delay', notification: { suppress: true, template: 'Default' } });
    expect(screen.getByLabelText('Skip Tasklist')).toBeChecked();
    expect(screen.getByLabelText('Delay')).toHaveValue('delay');
  });
});
