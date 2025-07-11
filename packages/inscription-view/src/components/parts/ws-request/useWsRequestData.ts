import type { WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useWsRequestData(): ConfigDataContext<WsRequestData> & {
  update: DataUpdater<WsRequestData>;
  updateOperation: DataUpdater<WsRequestData['operation']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<WsRequestData> = (field, value) => {
    setConfig(
      produce((draft: WsRequestData) => {
        draft[field] = value;
      })
    );
  };

  const updateOperation: DataUpdater<WsRequestData['operation']> = (field, value) => {
    setConfig(
      produce((draft: WsRequestData) => {
        draft.operation[field] = value;
      })
    );
  };

  return {
    ...config,
    update,
    updateOperation
  };
}
