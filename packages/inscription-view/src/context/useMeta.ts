import type { InscriptionMetaRequestTypes } from '@axonivy/process-editor-inscription-protocol';
import { useQuery } from '@tanstack/react-query';
import { useClient } from './useClient';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof InscriptionMetaRequestTypes>(
  path: TMeta,
  args: InscriptionMetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<InscriptionMetaRequestTypes[TMeta][1]>
) {
  const client = useClient();
  return useQuery({
    queryKey: [path, args],
    queryFn: () => client.meta(path, args),
    initialData: initialData
  });
}
