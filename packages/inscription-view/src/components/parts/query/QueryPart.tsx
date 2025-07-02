import { useQueryData } from './useQueryData';
import type { QueryData } from '@axonivy/process-editor-inscription-protocol';
import { DatabaseSelect } from './database/DatabaseSelect';
import { QueryKindSelect } from './database/QueryKindSelect';
import { usePartState, type PartProps } from '../../../components/editors/part/usePart';
import { QueryRead } from './db-query/QueryRead';
import { QueryWrite } from './db-query/QueryWrite';
import { QueryUpdate } from './db-query/QueryUpdate';
import { QueryDelete } from './db-query/QueryDelete';
import { QueryAny } from './db-query/QueryAny';
import { TableSelect } from './database/TableSelect';
import { useValidations } from '../../../context/useValidation';
import { PathContext } from '../../../context/usePath';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

export function useQueryPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useQueryData();
  const queryVal = useValidations(['query']);
  const compareData = (data: QueryData) => [data.query];
  const state = usePartState(compareData(defaultConfig), compareData(config), queryVal);
  return {
    id: 'Query',
    name: t('part.db.title'),
    state: state,
    content: <QueryPart />,
    icon: IvyIcons.Query
  };
}

const QueryPart = () => {
  const { t } = useTranslation();
  const { config } = useQueryData();
  const query = useQuery();
  return (
    <>
      <PathContext path='query'>
        <ValidationCollapsible label={t('label.database')} defaultOpen={true}>
          <QueryKindSelect />
          <DatabaseSelect />
          {config.query.sql.kind !== 'ANY' && <TableSelect />}
        </ValidationCollapsible>
        {query}
      </PathContext>
    </>
  );
};

const useQuery = () => {
  const { config } = useQueryData();
  switch (config.query.sql.kind) {
    case 'READ':
      return <QueryRead />;
    case 'WRITE':
      return <QueryWrite />;
    case 'UPDATE':
      return <QueryUpdate />;
    case 'DELETE':
      return <QueryDelete />;
    case 'ANY':
      return <QueryAny />;
  }
};
