import type { ProgramStartData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../../context/useDataContext';
import type { DataUpdater } from '../../../../types/lambda';

export function useProgramStartData(): ConfigDataContext<ProgramStartData> & {
  update: DataUpdater<ProgramStartData>;
  updatePermission: DataUpdater<ProgramStartData['permission']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<ProgramStartData> = (field, value) => {
    setConfig(
      produce((draft: ProgramStartData) => {
        draft[field] = value;
      })
    );
  };

  const updatePermission: DataUpdater<ProgramStartData['permission']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.permission[field] = value;
      })
    );
  };

  return {
    ...config,
    update,
    updatePermission
  };
}
