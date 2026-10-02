import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../../context/useAction';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';
import { IconSelect, type IconSelectItemWithProject } from '../../../widgets/select/Select';
import { PathFieldset } from '../../common/path/PathFieldset';
import { useQueryData } from '../useQueryData';

export const DatabaseSelect = () => {
  const { t } = useTranslation();
  const { config, update } = useQueryData();
  const { context } = useEditorContext();
  const databaseItems = useMeta('meta/database/clients', context, []).data.map<IconSelectItemWithProject>(db => ({
    label: db.name,
    value: db.name,
    iconUrl: db.iconUrl,
    project: db.project
  }));
  const selectedItem = databaseItems.find(i => i.value === config.query.dbName) ?? {
    label: config.query.dbName,
    value: config.query.dbName
  };
  const newAction = useAction('newDatabaseConfig');
  const openAction = useAction('openDatabaseConfig');
  const controls: Array<FieldsetControl> = [
    {
      label: t('part.db.clientOpen'),
      icon: IvyIcons.GoToSource,
      action: () => openAction(selectedItem.project ? { project: selectedItem.project } : undefined)
    },
    { label: t('part.db.clientCreate'), icon: IvyIcons.Plus, action: () => newAction() }
  ];

  return (
    <PathFieldset label={t('label.database')} path='dbName' controls={controls}>
      <IconSelect value={selectedItem} onChange={item => update('dbName', item.value)} items={databaseItems} />
    </PathFieldset>
  );
};
