import type { TaskData, WfTask } from '@axonivy/process-editor-inscription-protocol';
import type { DeepPartial } from 'test-utils';
import { customRender, customRenderHook, screen } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import type { TaskPartProps } from './TaskPart';
import { useTaskPart } from './TaskPart';

const Part = () => {
  const part = useTaskPart();
  return <>{part.content}</>;
};

describe('TaskPart', () => {
  function renderEmptyPart() {
    customRender(<Part />, { wrapperProps: { defaultData: { task: undefined } } });
  }

  function assertState(
    expectedState: PartStateFlag,
    task?: DeepPartial<WfTask>,
    taskData?: Partial<TaskData>,
    type?: TaskPartProps['type']
  ) {
    const data = taskData ? { config: taskData } : task ? { config: { task } } : undefined;
    const { result } = customRenderHook(() => useTaskPart({ type }), { wrapperProps: { data } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('empty data', async () => {
    renderEmptyPart();
    expect(screen.getByText('There is no (Task) output flow connected.')).toBeInTheDocument();
  });

  test('configured', async () => {
    assertState(undefined);
    assertState('configured', { name: 'name' });
    assertState('configured', { description: 'desc' });
    assertState('configured', { category: 'cat' });
    assertState('configured', { responsible: { type: 'ROLE_FROM_ATTRIBUTE', script: '' } });
    assertState('configured', { priority: { level: 'LOW', script: '' } });

    assertState('configured', { skipTasklist: true });
    assertState('configured', { notification: { suppress: true } });
    assertState('configured', { delay: 'delay' });
    assertState('configured', undefined, { persistOnStart: true }, 'request');

    assertState('configured', { expiry: { timeout: 'asf' } });

    assertState('configured', { customFields: [{ name: 'cf', type: 'NUMBER', value: '123' }] });
    assertState('configured', { code: 'code' });
  });
});
