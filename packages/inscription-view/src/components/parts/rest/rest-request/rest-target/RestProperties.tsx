import { useTranslation } from 'react-i18next';
import { useMeta } from '../../../../../context/useMeta';
import { PathProvider } from '../../../../../context/usePath';
import { deepEqual } from '../../../../../utils/equals';
import { PropertyTable } from '../../../common/properties/PropertyTable';
import { useRestRequestData } from '../../useRestRequestData';

export const RestProperties = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateTarget } = useRestRequestData();
  const knownProperties = useMeta('meta/rest/properties', undefined, []).data;
  return (
    <PathProvider path='properties'>
      <PropertyTable
        properties={config.target.properties}
        update={change => updateTarget('properties', change)}
        knownProperties={knownProperties}
        label={t('part.rest.properties')}
        defaultOpen={!deepEqual(config.target.properties, defaultConfig.target.properties)}
      />
    </PathProvider>
  );
};
