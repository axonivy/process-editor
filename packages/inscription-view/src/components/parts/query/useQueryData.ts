import type { QueryData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useQueryData(): ConfigDataContext<QueryData> & {
  update: DataUpdater<QueryData['query']>;
  updateSql: DataUpdater<QueryData['query']['sql']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<QueryData['query']> = (field, value) => {
    setConfig(
      produce((draft: QueryData) => {
        draft.query[field] = value;
      })
    );
  };

  const updateSql: DataUpdater<QueryData['query']['sql']> = (field, value) => {
    setConfig(
      produce((draft: QueryData) => {
        draft.query.sql[field] = value;
      })
    );
  };

  return {
    ...config,
    update,
    updateSql
  };
}
