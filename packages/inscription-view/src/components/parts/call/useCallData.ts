import type { CallData, DialogCallData, ProcessCallData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useCallData(): ConfigDataContext<CallData> & {
  update: DataUpdater<CallData['call']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<CallData['call']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.call[field] = value;
      })
    );
  };

  return { ...config, update };
}

export function useDialogCallData(): ConfigDataContext<DialogCallData> & {
  update: DataUpdater<DialogCallData>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<DialogCallData> = (field, value) => {
    setConfig(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  return { ...config, update };
}

export function useProcessCallData(): ConfigDataContext<ProcessCallData> & {
  update: DataUpdater<ProcessCallData>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ProcessCallData> = (field, value) => {
    setConfig(
      produce(draft => {
        draft[field] = value;
      })
    );
  };

  return { ...config, update };
}
