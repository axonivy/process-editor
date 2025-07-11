import type { InscriptionMetaRequestTypes } from '@axonivy/process-editor-inscription-protocol';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { genQueryKey } from '../query/query-client';
import { useClient } from './useClient';
type UseFunctionOptions<TData> = {
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
};

export function useFunction<TFunct extends keyof InscriptionMetaRequestTypes>(
  path: TFunct,
  initialArgs: InscriptionMetaRequestTypes[TFunct][0],
  options?: UseFunctionOptions<InscriptionMetaRequestTypes[TFunct][1]>
): UseMutationResult<InscriptionMetaRequestTypes[TFunct][1], Error, InscriptionMetaRequestTypes[TFunct][0] | undefined> {
  const client = useClient();

  return useMutation({
    mutationKey: genQueryKey([path, initialArgs]),
    mutationFn: (args?: InscriptionMetaRequestTypes[TFunct][0]) => client.meta(path, args ?? initialArgs),
    onSuccess: options?.onSuccess,
    onError: options?.onError
  });
}
