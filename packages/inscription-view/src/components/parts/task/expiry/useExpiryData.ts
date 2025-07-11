import type { WfExpiry } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useTaskDataContext } from '../../../../context/useDataContext';
import type { DataUpdater } from '../../../../types/lambda';
import type { ResponsibleUpdater } from '../../common/responsible/ResponsibleSelect';
import type { PriorityUpdater } from '../priority/PrioritySelect';

export function useExpiryData(): {
  expiry: WfExpiry;
  defaultExpiry: WfExpiry;
  update: DataUpdater<WfExpiry>;
  updateResponsible: ResponsibleUpdater;
  updatePriority: PriorityUpdater;
} {
  const { task, defaultTask, setTask } = useTaskDataContext();

  const update: DataUpdater<WfExpiry> = (field, value) => {
    setTask(
      produce(draft => {
        draft.expiry[field] = value;
      })
    );
  };

  const updateResponsible: ResponsibleUpdater = (field, value) => {
    setTask(
      produce(draft => {
        draft.expiry.responsible[field] = value;
      })
    );
  };

  const updatePriority: PriorityUpdater = (field, value) => {
    setTask(
      produce(draft => {
        draft.expiry.priority[field] = value;
      })
    );
  };

  return {
    expiry: task.expiry,
    defaultExpiry: defaultTask.expiry,
    update,
    updateResponsible,
    updatePriority
  };
}
