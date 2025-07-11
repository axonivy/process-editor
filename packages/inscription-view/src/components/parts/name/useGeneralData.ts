import type { GeneralData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useGeneralData(): {
  data: GeneralData;
  initData: GeneralData;
  update: DataUpdater<GeneralData>;
} {
  const { data, initData, setData } = useDataContext();

  const update: DataUpdater<GeneralData> = (field, value) =>
    setData(
      produce((draft: GeneralData) => {
        draft[field] = value;
      })
    );

  return { data, initData, update };
}
