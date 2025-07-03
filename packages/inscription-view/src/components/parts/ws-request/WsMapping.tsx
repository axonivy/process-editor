import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathContext } from '../../../context/usePath';
import MappingPart from '../common/mapping-tree/MappingPart';
import { useWsRequestData } from './useWsRequestData';

export const WsMapping = () => {
  const { config, defaultConfig, updateOperation } = useWsRequestData();

  const { context } = useEditorContext();
  const variableInfo = useMeta('meta/webservice/operations', { clientId: config.clientId, port: config.operation.port, context }, [])
    .data.filter(operation => operation.name === config.operation.name)
    .map(operation => operation.parameter)
    .find(() => true) ?? { variables: [], types: {} };

  return (
    <PathContext path='operation'>
      <MappingPart
        data={config.operation.parameters}
        defaultData={defaultConfig.operation.parameters}
        onChange={change => updateOperation('parameters', change)}
        variableInfo={variableInfo}
        path='parameters'
        browsers={['attr', 'func', 'type', 'cms']}
      />
    </PathContext>
  );
};
