import type { InscriptionMetaRequestTypes } from '@axonivy/process-editor-inscription-protocol';
import { useQuery } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import { useClient } from './useClient';

type NonUndefinedGuard<T> = T extends undefined ? never : T;

export function useMeta<TMeta extends keyof InscriptionMetaRequestTypes>(
  path: TMeta,
  args: InscriptionMetaRequestTypes[TMeta][0],
  initialData: NonUndefinedGuard<InscriptionMetaRequestTypes[TMeta][1]>,
  options?: { disable?: boolean }
) {
  const client = useClient();
  return useQuery({
    enabled: !options?.disable,
    queryKey: genQueryKey(path, args),
    queryFn: () => client.meta(path, args),
    initialData: initialData
  });
}
