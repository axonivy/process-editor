import type { TaskData } from '@axonivy/process-editor-inscription-protocol';
import { DEFAULT_TASK, DEFAULT_TASK_DATA } from '@axonivy/process-editor-inscription-protocol';
import { deepmerge } from 'deepmerge-ts';
import type { DeepPartial } from 'test-utils';
import { customRender, customRenderHook, screen, userEvent } from 'test-utils';
import { describe, expect, test } from 'vitest';
import type { PartStateFlag } from '../../editors/part/usePart';
import { useMultiTasksPart } from './MultiTasksPart';

const Part = () => {
  const part = useMultiTasksPart();
  return <>{part.content}</>;
};

describe('MultiTasksPart', () => {
  function renderPart(data?: DeepPartial<TaskData>) {
    data = addDefaultTaskData(data);
    const defaultData = createDefaultTaskData(data);
    customRender(<Part />, {
      wrapperProps: {
        data: data && { config: data },
        defaultData,
        validations: [{ path: 'tasks.[1].name', message: 'this is an error', severity: 'ERROR' }]
      }
    });
  }

  test('empty data', async () => {
    renderPart();
    expect(screen.getByText('There is no (Task) output flow connected.')).toBeInTheDocument();
  });

  test('full data', async () => {
    renderPart({
      tasks: [
        { id: 'TaskA', name: 'task 1' },
        { id: 'TaskB', name: 'task 2' }
      ]
    });
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('tab', { name: 'TaskA' })).not.toHaveAttribute('data-message');
    expect(screen.getByRole('tab', { name: 'TaskB' })).toHaveAttribute('data-message', 'error');

    expect(screen.getByLabelText('Name')).toHaveValue('task 1');
    await userEvent.click(screen.getByRole('tab', { name: 'TaskB' }));
    expect(screen.getByLabelText('Name')).toHaveValue('task 2');
  });

  function assertState(expectedState: PartStateFlag, data?: DeepPartial<TaskData>) {
    data = addDefaultTaskData(data);
    const defaultData = createDefaultTaskData(data);
    const { result } = customRenderHook(() => useMultiTasksPart(), { wrapperProps: { data: data && { config: data }, defaultData } });
    expect(result.current.state.state).toEqual(expectedState);
  }

  test('configured', async () => {
    assertState(undefined);
    assertState(undefined, { tasks: [] });
    assertState(undefined, { tasks: [{ id: 'TaskA' }] });
    assertState('configured', { tasks: [{ id: 'TaskA', name: 'task1' }] });
  });

  function addDefaultTaskData(data?: DeepPartial<TaskData>): DeepPartial<TaskData> | undefined {
    if (data) {
      data.tasks = data.tasks?.map(task => deepmerge(DEFAULT_TASK, task));
    }
    return data;
  }

  function createDefaultTaskData(data?: DeepPartial<TaskData>): DeepPartial<TaskData> {
    if (data && data.tasks) {
      return {
        tasks: data.tasks.map(task => {
          const dTask = DEFAULT_TASK;
          dTask.id = task.id ?? '';
          return dTask;
        })
      };
    }
    return DEFAULT_TASK_DATA;
  }
});
