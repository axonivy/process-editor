import type { ProcessDataData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useProcessDataData(): ConfigDataContext<ProcessDataData> & {
  update: DataUpdater<ProcessDataData>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ProcessDataData> = (field, value) => {
    setConfig(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  return {
    ...config,
    update
  };
}
