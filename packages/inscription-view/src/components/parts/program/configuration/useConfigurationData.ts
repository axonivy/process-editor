import type { ConfigurationData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../../context/useDataContext';
import type { DataUpdater } from '../../../../types/lambda';

export function useConfigurationData(): ConfigDataContext<ConfigurationData> & {
  updateUserConfig: DataUpdater<ConfigurationData['userConfig']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const updateUserConfig: DataUpdater<ConfigurationData['userConfig']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.userConfig[field] = value;
      })
    );
  };

  return {
    ...config,
    updateUserConfig
  };
}
