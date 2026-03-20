import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../../../context/useAction';
import { useEditorContext } from '../../../../../context/useEditorContext';
import { useMeta } from '../../../../../context/useMeta';
import type { FieldsetControl } from '../../../../widgets/fieldset/fieldset-control';
import type { IconSelectItem } from '../../../../widgets/select/Select';
import { IconSelect } from '../../../../widgets/select/Select';
import { PathFieldset } from '../../../common/path/PathFieldset';
import { useRestRequestData } from '../../useRestRequestData';

export const RestClientSelect = () => {
  const { t } = useTranslation();
  const { config, updateTarget } = useRestRequestData();

  const { context } = useEditorContext();
  const items = useMeta('meta/rest/clients', context, []).data.map<IconSelectItem>(client => ({
    label: client.name,
    value: client.clientId,
    iconUrl: client.iconUrl
  }));
  const selectedItem = items.find(i => i.value === config.target.clientId) ?? {
    label: config.target.clientId,
    value: config.target.clientId
  };

  const newAction = useAction('newRestClient');
  const openAction = useAction('openRestConfig');
  const controls: FieldsetControl[] = [
    { label: t('part.rest.restConfigOpen'), icon: IvyIcons.GoToSource, action: () => openAction() },
    { label: t('part.rest.restConfigCreate'), icon: IvyIcons.Plus, action: () => newAction() }
  ];

  return (
    <PathFieldset label={t('part.rest.client')} path='clientId' controls={controls}>
      <div className='rest-client-select'>
        <IconSelect value={selectedItem} onChange={item => updateTarget('clientId', item.value)} items={items} />
      </div>
    </PathFieldset>
  );
};
