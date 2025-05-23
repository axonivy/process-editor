import type { RequestData, TaskData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import type { Consumer } from '../../../../types/lambda';
import { useConfigDataContext, type ConfigDataContext } from '../../../../context/useDataContext';

export type TaskPersistData = Pick<TaskData, 'persistOnStart'> & Pick<RequestData, 'permission'>;

export function useTaskPersistData(): ConfigDataContext<TaskPersistData> & {
  updatePersist: Consumer<boolean>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const updatePersist = (persistOnStart: boolean) =>
    setConfig(
      produce(draft => {
        draft.persistOnStart = persistOnStart;
      })
    );

  return { ...config, updatePersist };
}
