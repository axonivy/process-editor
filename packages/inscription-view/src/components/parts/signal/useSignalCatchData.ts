import type { SignalCatchData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, useDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { Consumer, DataUpdater } from '../../../types/lambda';

export function useSignalCatchData(): ConfigDataContext<SignalCatchData> & {
  update: DataUpdater<SignalCatchData>;
  updateSignal: Consumer<string>;
} {
  const { setData } = useDataContext();
  const { setConfig, ...config } = useConfigDataContext();

  const updateSignal = (signalCode: string) => {
    setData(
      produce(draft => {
        if (draft.name === draft.config.signalCode) {
          draft.name = signalCode;
        }
        draft.config.signalCode = signalCode;
      })
    );
  };

  const update: DataUpdater<SignalCatchData> = (field, value) => {
    setConfig(
      produce((draft: SignalCatchData) => {
        draft[field] = value;
      })
    );
  };

  return { ...config, update, updateSignal };
}
