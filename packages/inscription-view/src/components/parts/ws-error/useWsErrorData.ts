import type { WsErrorData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useWsErrorData(): ConfigDataContext<WsErrorData> & {
  update: DataUpdater<WsErrorData>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<WsErrorData> = (field, value) => {
    setConfig(
      produce((draft: WsErrorData) => {
        draft[field] = value;
      })
    );
  };

  return {
    ...config,
    update
  };
}
