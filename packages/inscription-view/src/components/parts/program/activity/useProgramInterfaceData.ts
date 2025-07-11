import type { ProgramInterfaceStartData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../../context/useDataContext';
import type { DataUpdater } from '../../../../types/lambda';

export function useProgramInterfaceData(): ConfigDataContext<ProgramInterfaceStartData> & {
  update: DataUpdater<ProgramInterfaceStartData>;
  updateTimeout: DataUpdater<ProgramInterfaceStartData['timeout']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ProgramInterfaceStartData> = (field, value) => {
    setConfig(
      produce((draft: ProgramInterfaceStartData) => {
        draft[field] = value;
      })
    );
  };

  const updateTimeout: DataUpdater<ProgramInterfaceStartData['timeout']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.timeout[field] = value;
      })
    );
  };

  return {
    ...config,
    update,
    updateTimeout
  };
}
