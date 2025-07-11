import type { RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useRestOutputData(): ConfigDataContext<RestResponseData> & {
  updateEntity: DataUpdater<RestResponseData['response']['entity']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const updateEntity: DataUpdater<RestResponseData['response']['entity']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.response.entity[field] = value;
      })
    );
  };

  return {
    ...config,
    updateEntity
  };
}
