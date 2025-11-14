import type { OutputData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import React from 'react';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { Consumer, DataUpdater } from '../../../types/lambda';

export function useOutputData(): ConfigDataContext<OutputData> & {
  update: DataUpdater<OutputData['output']>;
  updateSudo: Consumer<boolean>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<OutputData['output']> = React.useCallback(
    (field, value) => {
      setConfig(
        produce(draft => {
          draft.output[field] = value;
        })
      );
    },
    [setConfig]
  );

  const updateSudo = React.useCallback(
    (sudo: boolean) =>
      setConfig(
        produce(draft => {
          draft.sudo = sudo;
        })
      ),
    [setConfig]
  );

  return {
    ...config,
    update,
    updateSudo
  };
}
