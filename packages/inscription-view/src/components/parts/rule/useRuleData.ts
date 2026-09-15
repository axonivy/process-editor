import type { RuleData } from '@axonivy/process-editor-inscription-protocol/src';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useRuleData(): ConfigDataContext<RuleData> & {
  update: DataUpdater<RuleData['rule']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<RuleData['rule']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.rule[field] = value;
      })
    );
  };

  return {
    ...config,
    update
  };
}
