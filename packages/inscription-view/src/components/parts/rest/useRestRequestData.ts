import type { HttpMethod, RestRequestData, ScriptMappings } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { Consumer, DataUpdater } from '../../../types/lambda';

export function useRestRequestData(): ConfigDataContext<RestRequestData> & {
  update: DataUpdater<RestRequestData>;
  updateBody: DataUpdater<RestRequestData['body']>;
  updateEntity: DataUpdater<RestRequestData['body']['entity']>;
  updateMethod: Consumer<string>;
  updateTarget: DataUpdater<RestRequestData['target']>;
  updateAcceptHeader: Consumer<string>;
  updateParameters: Consumer<{ queryParams: ScriptMappings; templateParams: ScriptMappings }>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<RestRequestData> = (field, value) => {
    setConfig(
      produce((draft: RestRequestData) => {
        draft[field] = value;
      })
    );
  };

  const updateBody: DataUpdater<RestRequestData['body']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.body[field] = value;
      })
    );
  };

  const updateEntity: DataUpdater<RestRequestData['body']['entity']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.body.entity[field] = value;
      })
    );
  };

  const updateMethod: Consumer<string> = value => {
    setConfig(
      produce((draft: RestRequestData) => {
        const [method, path] = value.split(':');
        draft.method = method as HttpMethod;
        draft.target.path = path ?? '';
      })
    );
  };

  const updateTarget: DataUpdater<RestRequestData['target']> = (field, value) => {
    setConfig(
      produce(draft => {
        draft.target[field] = value;
      })
    );
  };

  const updateAcceptHeader: Consumer<string> = value => {
    setConfig(
      produce(draft => {
        draft.target.headers['Accept'] = value;
      })
    );
  };

  const updateParameters: Consumer<{ queryParams: ScriptMappings; templateParams: ScriptMappings }> = value => {
    setConfig(
      produce(draft => {
        draft.target.queryParams = value.queryParams;
        draft.target.templateParams = value.templateParams;
      })
    );
  };

  return {
    ...config,
    update,
    updateBody,
    updateEntity,
    updateMethod,
    updateTarget,
    updateAcceptHeader,
    updateParameters
  };
}
