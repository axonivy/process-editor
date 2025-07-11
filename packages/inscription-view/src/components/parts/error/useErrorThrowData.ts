import type { ErrorThrowData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, useDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useErrorThrowData(): ConfigDataContext<ErrorThrowData> & {
  update: DataUpdater<ErrorThrowData>;
  updateThrows: DataUpdater<ErrorThrowData['throws']>;
} {
  const { setData } = useDataContext();
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ErrorThrowData> = (field, value) => {
    setConfig(
      produce((draft: ErrorThrowData) => {
        draft[field] = value;
      })
    );
  };

  const updateThrows: DataUpdater<ErrorThrowData['throws']> = (field, value) => {
    setData(
      produce(draft => {
        if (field === 'error' && draft.name === draft.config.throws.error) {
          draft.name = value;
        }
        draft.config.throws[field] = value;
      })
    );
  };

  return { ...config, update, updateThrows };
}
