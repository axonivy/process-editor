import { isNotUndefined } from '@axonivy/ui-components';
import { useMemo } from 'react';
import { useEditorContext } from '../../../../../context/useEditorContext';
import { useMeta } from '../../../../../context/useMeta';
import { useRestRequestData } from '../../useRestRequestData';

export const useTargetPathSplit = (path: string) => {
  return path.split(/(\{[^}]*\})/gm);
};

export const useFindPathParams = () => {
  const { config } = useRestRequestData();
  const { context } = useEditorContext();
  const clientUri = useMeta('meta/rest/clientUri', { context, clientId: config.target.clientId }, '').data;
  return useMemo(() => {
    const path = `${clientUri}${config.target.path}`;
    return [...path.matchAll(/\{([^}]*)\}/gm)].map(match => match[1]).filter(isNotUndefined);
  }, [clientUri, config.target.path]);
};
