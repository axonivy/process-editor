import type { HttpMethod, RestRequestData, RestResource, RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext } from '../../../context/useDataContext';
import { evalBodyType, evalInputType } from './known-types';

export function useUpdateRestResource(): {
  updateResource: (value: string, resource?: RestResource) => void;
} {
  const { setConfig } = useConfigDataContext();

  const updateResource: (value: string, resource?: RestResource) => void = (value, resource) => {
    setConfig(
      produce((draft: RestRequestData & RestResponseData) => {
        const [method, path] = value.split(':');
        draft.method = method as HttpMethod;
        draft.target.path = path ?? '';

        if (resource) {
          const payload = resource.method.inBody;
          draft.body.type = evalBodyType(payload.media);
          draft.body.entity.type = evalInputType(payload, draft.body.entity.type, 'java.io.File');
          if (payload.media && payload.media.length > 0) {
            draft.body.mediaType = payload.media;
          }
          draft.response.entity.type = evalInputType(resource.method.outResult, draft.response.entity.type, 'java.io.InputStream');
        }
      })
    );
  };

  return {
    updateResource
  };
}
