import type { WfNotification, WfTask } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useTaskDataContext, type TaskDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';
import type { ResponsibleUpdater } from '../common/responsible/ResponsibleSelect';
import type { PriorityUpdater } from './priority/PrioritySelect';

type NotificationUpdater = DataUpdater<WfNotification>;

export function useTaskData(): TaskDataContext & {
  update: DataUpdater<WfTask>;
  updateResponsible: ResponsibleUpdater;
  updatePriority: PriorityUpdater;
  updateNotification: NotificationUpdater;
} {
  const { setTask, ...task } = useTaskDataContext();

  const update: DataUpdater<WfTask> = (field, value) => {
    setTask(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  const updateResponsible: ResponsibleUpdater = (field, value) => {
    setTask(
      produce(draft => {
        draft.responsible[field] = value;
      })
    );
  };

  const updatePriority: PriorityUpdater = (field, value) => {
    setTask(
      produce(draft => {
        draft.priority[field] = value;
      })
    );
  };

  const updateNotification: NotificationUpdater = (field, value) => {
    setTask(
      produce(draft => {
        draft.notification[field] = value;
      })
    );
  };

  return {
    ...task,
    update,
    updateResponsible,
    updatePriority,
    updateNotification
  };
}
