import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { PathProvider } from '../../../../context/usePath';
import Combobox, { type ComboboxItem } from '../../../widgets/combobox/Combobox';
import { PathFieldset } from '../../common/path/PathFieldset';
import { useQueryData } from '../useQueryData';

export const TableSelect = () => {
  const { t } = useTranslation();
  const { config, updateSql } = useQueryData();
  const { elementContext: context } = useEditorContext();
  const tableItems = useMeta('meta/database/tables', { context, database: config.query.dbName }, []).data.map<ComboboxItem>(table => ({
    value: table
  }));

  return (
    <PathProvider path='sql'>
      <PathFieldset label={t('part.db.table')} path='table'>
        <Combobox value={config.query.sql.table} onChange={change => updateSql('table', change)} items={tableItems} />
      </PathFieldset>
    </PathProvider>
  );
};
