import type { DbErrorData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../../context/useDataContext';
import type { Consumer } from '../../../../types/lambda';

export function useDbErrorData(): ConfigDataContext<DbErrorData> & {
  updateException: Consumer<string>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const updateException = (value: string) => {
    setConfig(
      produce(draft => {
        draft.exceptionHandler = value;
      })
    );
  };

  return {
    ...config,
    updateException
  };
}
