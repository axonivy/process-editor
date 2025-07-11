import { useEffect, useMemo, useState } from 'react';
import { useEditorContext } from '../../../../../context/useEditorContext';
import { useMeta } from '../../../../../context/useMeta';
import { useRestRequestData } from '../../useRestRequestData';

export const useTargetPathSplit = (path: string) => {
  return path.split(/(\{[^}]*\})/gm);
};

export const useFindPathParams = () => {
  const { config } = useRestRequestData();
  const [path, setPath] = useState(config.target.path);
  const { context } = useEditorContext();
  const clientUri = useMeta('meta/rest/clientUri', { context, clientId: config.target.clientId }, '').data;
  useEffect(() => {
    setPath(`${clientUri}${config.target.path}`);
  }, [clientUri, config.target.path]);
  return useMemo(() => [...path.matchAll(/\{([^}]*)\}/gm)].map(match => match[1]), [path]);
};
