import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../../context/useAction';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';
import Select, { type SelectItem } from '../../../widgets/select/Select';
import { PathFieldset } from '../../common/path/PathFieldset';
import { useQueryData } from '../useQueryData';

export const DatabaseSelect = () => {
  const { t } = useTranslation();
  const { config, update } = useQueryData();
  const { context } = useEditorContext();
  const databaseItems = useMeta('meta/database/names', context, []).data.map<SelectItem>(db => {
    return { label: db, value: db };
  });
  const newAction = useAction('newDatabaseConfig');
  const openAction = useAction('openDatabaseConfig');
  const openDbConfig: FieldsetControl = { label: t('part.db.clientOpen'), icon: IvyIcons.GoToSource, action: () => openAction() };
  const createDbConfig: FieldsetControl = { label: t('part.db.clientCreate'), icon: IvyIcons.Plus, action: () => newAction() };

  return (
    <PathFieldset label={t('label.database')} path='dbName' controls={[openDbConfig, createDbConfig]}>
      <Select
        value={{ label: config.query.dbName, value: config.query.dbName }}
        onChange={item => update('dbName', item.value)}
        items={databaseItems}
      />
    </PathFieldset>
  );
};
