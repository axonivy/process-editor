import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathProvider } from '../../../context/usePath';
import type { SelectItem } from '../../widgets/select/Select';
import { Select } from '../../widgets/select/Select';
import { PathFieldset } from '../common/path/PathFieldset';
import { useWsRequestData } from './useWsRequestData';

export const WsOperationSelect = () => {
  const { t } = useTranslation();
  const { config, updateOperation } = useWsRequestData();

  const { context } = useEditorContext();
  const items = useMeta(
    'meta/webservice/operations',
    { clientId: config.clientId, port: config.operation.port, context },
    []
  ).data.map<SelectItem>(operation => {
    return { label: operation.name, value: operation.name };
  });
  const selectedItem = items.find(i => i.value === config.operation.name) ?? { label: config.operation.name, value: config.operation.name };

  return (
    <PathProvider path='operation'>
      <PathFieldset label={t('part.ws.operation')} path='name'>
        <Select value={selectedItem} onChange={item => updateOperation('name', item.value)} items={items} />
      </PathFieldset>
    </PathProvider>
  );
};
