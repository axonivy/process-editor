import { Fragment } from 'react';
import { useEditorContext } from '../../../../../context/useEditorContext';
import { useMeta } from '../../../../../context/useMeta';
import { useRestRequestData } from '../../useRestRequestData';
import './RestTargetUrl.css';
import { useTargetPathSplit } from './usePathParams';

const RestTargetQueryParams = ({ queryParams }: { queryParams: [string, string][] }) => {
  if (queryParams.length === 0) {
    return <></>;
  }
  const params = queryParams.map(([name, value], index) => {
    if (value !== undefined && value.length > 0) {
      return (
        <Fragment key={`${index}-${name}`}>
          <span className='query-name'>{name}</span>=<span className='query-value'>{value}</span>
        </Fragment>
      );
    }
    return (
      <span key={`${index}-${name}`} className='query-name'>
        {name}
      </span>
    );
  });
  return (
    <>
      ?
      {params.map((p, index) => (
        <Fragment key={index}>
          {p}
          {index < params.length - 1 ? '&' : ''}
        </Fragment>
      ))}
    </>
  );
};

const RestTargetPath = ({ path }: { path: string }) => {
  const parts = useTargetPathSplit(path);
  return (
    <>
      {parts.map((part, index) => {
        if (part.includes('{') && part.includes('}')) {
          return (
            <span key={`${index}-${part}`} className='path-param'>
              {part}
            </span>
          );
        }
        return <Fragment key={`${index}-${part}`}>{part}</Fragment>;
      })}
    </>
  );
};

export const RestTargetUrl = () => {
  const { config } = useRestRequestData();
  const { context } = useEditorContext();
  const clientUri = useMeta('meta/rest/clientUri', { context, clientId: config.target.clientId }, '').data;
  let baseUri = clientUri;
  if (baseUri.endsWith('/')) {
    baseUri = baseUri.slice(0, -1);
  }
  let path = config.target.path;
  if (path && !path.startsWith('/')) {
    path = `/${path}`;
  }
  return (
    <>
      {config.target.clientId?.length > 0 && (
        <div className='rest-target'>
          <div className='rest-target-url'>
            <RestTargetPath path={`${baseUri}${path}`} />
            <RestTargetQueryParams queryParams={Object.entries(config.target.queryParams)} />
          </div>
        </div>
      )}
    </>
  );
};
