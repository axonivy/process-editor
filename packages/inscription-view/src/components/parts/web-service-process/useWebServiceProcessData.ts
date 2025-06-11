import type { WebServiceProcessData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { DataUpdater } from '../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';

export function useWebServiceProcessData(): ConfigDataContext<WebServiceProcessData> & {
  update: DataUpdater<WebServiceProcessData>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<WebServiceProcessData> = (field, value) => {
    setConfig(
      produce((draft: WebServiceProcessData) => {
        draft[field] = value;
      })
    );
  };
  return {
    ...config,
    update
  };
}
