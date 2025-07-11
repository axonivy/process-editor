import type { ConditionData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useConditionData(): ConfigDataContext<ConditionData> & {
  update: DataUpdater<ConditionData>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ConditionData> = (field, value) => {
    setConfig(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  return { ...config, update };
}
