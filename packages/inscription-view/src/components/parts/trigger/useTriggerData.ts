import type { TriggerData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';
import type { ResponsibleUpdater } from '../common/responsible/ResponsibleSelect';

export function useTriggerData(): ConfigDataContext<TriggerData> & {
  update: DataUpdater<TriggerData>;
  updateResponsible: ResponsibleUpdater;
  updateDelay: (value: string) => void;
  updateAttach: (value: boolean) => void;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<TriggerData> = (field, value) => {
    setConfig(
      produce((draft: TriggerData) => {
        draft[field] = value;
      })
    );
  };

  const updateResponsible: ResponsibleUpdater = (field, value) => {
    setConfig(
      produce(draft => {
        draft.task.responsible[field] = value;
      })
    );
  };

  const updateDelay = (value: string) => {
    setConfig(
      produce(draft => {
        draft.task.delay = value;
      })
    );
  };

  const updateAttach = (value: boolean) => {
    setConfig(
      produce(draft => {
        draft.case.attachToBusinessCase = value;
      })
    );
  };

  return {
    ...config,
    update,
    updateResponsible,
    updateDelay,
    updateAttach
  };
}
