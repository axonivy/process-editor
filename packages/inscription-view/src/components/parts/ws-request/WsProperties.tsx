import { useWsRequestData } from './useWsRequestData';
import { PropertyTable } from '../common/properties/PropertyTable';
import { deepEqual } from '../../../utils/equals';
import { PathContext } from '../../../context/usePath';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { useTranslation } from 'react-i18next';

export const WsProperties = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update } = useWsRequestData();

  const { context } = useEditorContext();
  const knownProperties = useMeta('meta/webservice/properties', { clientId: config.clientId, context }, []).data;

  return (
    <PathContext path='properties'>
      <PropertyTable
        properties={config.properties}
        update={change => update('properties', change)}
        knownProperties={knownProperties}
        label={t('part.ws.properties')}
        defaultOpen={!deepEqual(config.properties, defaultConfig.properties)}
      />
    </PathContext>
  );
};
