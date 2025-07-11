import type { OutputData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { Consumer, DataUpdater } from '../../../types/lambda';

export function useOutputData(): ConfigDataContext<OutputData> & {
  update: DataUpdater<OutputData['output']>;
  updateSudo: Consumer<boolean>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<OutputData['output']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.output[field] = value;
      })
    );
  };

  const updateSudo = (sudo: boolean) =>
    setConfig(
      produce(draft => {
        draft.sudo = sudo;
      })
    );

  return {
    ...config,
    update,
    updateSudo
  };
}
