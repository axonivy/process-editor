import { Fragment } from 'react';
import { useEditorContext } from '../../../../../context/useEditorContext';
import { useMeta } from '../../../../../context/useMeta';
import { useRestRequestData } from '../../useRestRequestData';
import './RestTargetUrl.css';
import { targetPathSplit } from './usePathParams';

const RestTargetQueryParams = ({ queryParams }: { queryParams: [string, string][] }) => {
  if (queryParams.length === 0) {
    return null;
  }
  return (
    <>
      ?
      {queryParams.map(([name, value], index) => (
        <Fragment key={`${name}-${value}`}>
          <span className='query-name'>{name}</span>
          {value !== undefined && value.length > 0 && (
            <>
              =<span className='query-value'>{value}</span>
            </>
          )}
          {index < queryParams.length - 1 ? '&' : ''}
        </Fragment>
      ))}
    </>
  );
};

const RestTargetPath = ({ path }: { path: string }) => {
  const parts = targetPathSplit(path);
  return (
    <>
      {parts.map((part, index) => {
        if (part.includes('{') && part.includes('}')) {
          return (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <span key={`${index}-${part}`} className='path-param'>
              {part}
            </span>
          );
        }
        // eslint-disable-next-line @eslint-react/no-array-index-key
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
