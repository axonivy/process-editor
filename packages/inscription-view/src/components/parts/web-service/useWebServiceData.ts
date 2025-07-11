import type { WebserviceStartData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useWebServiceData(): ConfigDataContext<WebserviceStartData> & {
  updatePermission: DataUpdater<WebserviceStartData['permission']>;
  updateException: DataUpdater<WebserviceStartData['exception']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const updatePermission: DataUpdater<WebserviceStartData['permission']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.permission[field] = value;
      })
    );
  };

  const updateException: DataUpdater<WebserviceStartData['exception']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.exception[field] = value;
      })
    );
  };

  return {
    ...config,
    updatePermission,
    updateException
  };
}
