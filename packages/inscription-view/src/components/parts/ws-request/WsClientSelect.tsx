import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../context/useAction';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import type { FieldsetControl } from '../../widgets/fieldset/fieldset-control';
import Select, { type SelectItem } from '../../widgets/select/Select';
import { PathFieldset } from '../common/path/PathFieldset';
import { useWsRequestData } from './useWsRequestData';

export const WsClientSelect = () => {
  const { t } = useTranslation();
  const { config, update } = useWsRequestData();

  const { context } = useEditorContext();
  const items = useMeta('meta/webservice/clients', context, []).data.map<SelectItem>(client => {
    return { label: client.name, value: client.clientId };
  });
  const selectedItem = items.find(i => i.value === config.clientId) ?? { label: config.clientId, value: config.clientId };

  const newAction = useAction('newWebServiceClient');
  const openAction = useAction('openConfig');
  const openWsConfig: FieldsetControl = { label: t('part.ws.clientOpen'), icon: IvyIcons.GoToSource, action: () => openAction() };
  const createWsClient: FieldsetControl = { label: t('part.ws.clientCreate'), icon: IvyIcons.Plus, action: () => newAction() };

  return (
    <PathFieldset label={t('part.ws.client')} path='clientId' controls={[openWsConfig, createWsClient]}>
      <Select value={selectedItem} onChange={item => update('clientId', item.value)} items={items} />
    </PathFieldset>
  );
};
