import type { RequestData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useRequestData(): ConfigDataContext<RequestData> & {
  updateRequest: DataUpdater<RequestData['request']>;
  updatePermission: DataUpdater<RequestData['permission']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const updateRequest: DataUpdater<RequestData['request']> = (field, value) => {
    setConfig(
      produce((draft: RequestData) => {
        draft.request[field] = value;
      })
    );
  };

  const updatePermission: DataUpdater<RequestData['permission']> = (field, value) => {
    setConfig(
      produce((draft: RequestData) => {
        draft.permission[field] = value;
      })
    );
  };

  return {
    ...config,
    updateRequest,
    updatePermission
  };
}
