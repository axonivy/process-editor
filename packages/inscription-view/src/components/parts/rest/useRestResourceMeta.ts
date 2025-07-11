import type { RestResource } from '@axonivy/process-editor-inscription-protocol';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { useRestRequestData } from './useRestRequestData';

export const useRestResourceMeta = (): Partial<RestResource> => {
  const { config } = useRestRequestData();
  const { context } = useEditorContext();
  const resource = useMeta(
    'meta/rest/resource',
    { context, clientId: config.target.clientId, method: config.method, path: config.target.path },
    {} as RestResource
  ).data;
  if (resource === null) {
    return {};
  }
  return resource;
};

export const useRestEntityTypeMeta = (location: 'entity' | 'result') => {
  const { config } = useRestRequestData();
  const { context } = useEditorContext();
  return useMeta(
    `meta/rest/${location}Types`,
    { context, clientId: config.target.clientId, method: config.method, path: config.target.path },
    []
  ).data;
};
