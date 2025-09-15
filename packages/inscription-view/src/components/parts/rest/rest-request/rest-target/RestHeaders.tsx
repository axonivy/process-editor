import { useTranslation } from 'react-i18next';
import { useMeta } from '../../../../../context/useMeta';
import { deepEqual } from '../../../../../utils/equals';
import Combobox, { type ComboboxItem } from '../../../../widgets/combobox/Combobox';
import Fieldset from '../../../../widgets/fieldset/Fieldset';
import { PathCollapsible } from '../../../common/path/PathCollapsible';
import { PropertyTable } from '../../../common/properties/PropertyTable';
import { useRestRequestData } from '../../useRestRequestData';
import { useRestResourceMeta } from '../../useRestResourceMeta';

export const RestHeaders = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateTarget, updateAcceptHeader } = useRestRequestData();

  const knownContentTypes = useMeta('meta/rest/contentTypes', { forBody: false }, []).data.map<ComboboxItem>(type => ({ value: type }));
  const knownHeaders = useMeta('meta/rest/headers', undefined, []).data;
  const restResourceHeaders = useRestResourceMeta().headers?.map(header => header.name) ?? [];

  return (
    <PathCollapsible
      label={t('part.rest.headers')}
      path='headers'
      defaultOpen={!deepEqual(config.target.headers, defaultConfig.target.headers)}
    >
      <Fieldset label={t('part.rest.accept')}>
        <Combobox value={config.target.headers['Accept'] ?? ''} onChange={updateAcceptHeader} items={knownContentTypes} />
      </Fieldset>
      <PropertyTable
        properties={config.target.headers}
        update={change => updateTarget('headers', change)}
        knownProperties={[...restResourceHeaders, ...knownHeaders]}
        hideProperties={['Accept']}
        label={t('part.rest.acceptProperties')}
        defaultOpen={true}
      />
    </PathCollapsible>
  );
};
