import type { RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useRestErrorData(): ConfigDataContext<RestResponseData> & {
  update: DataUpdater<RestResponseData['response']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<RestResponseData['response']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.response[field] = value;
      })
    );
  };

  return {
    ...config,
    update
  };
}
