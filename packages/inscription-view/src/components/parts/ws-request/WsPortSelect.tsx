import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathProvider } from '../../../context/usePath';
import { Select, type SelectItem } from '../../widgets/select/Select';
import { PathFieldset } from '../common/path/PathFieldset';
import { useWsRequestData } from './useWsRequestData';

export const WsPortSelect = () => {
  const { t } = useTranslation();
  const { config, updateOperation } = useWsRequestData();

  const { context } = useEditorContext();
  const items = useMeta('meta/webservice/ports', { clientId: config.clientId, context }, []).data.map<SelectItem>(port => {
    return { label: port, value: port };
  });
  const selectedItem = items.find(i => i.value === config.operation.port) ?? { label: config.operation.port, value: config.operation.port };

  return (
    <PathProvider path='operation'>
      <PathFieldset label={t('part.ws.port')} path='port'>
        <Select value={selectedItem} onChange={item => updateOperation('port', item.value)} items={items} />
      </PathFieldset>
    </PathProvider>
  );
};
