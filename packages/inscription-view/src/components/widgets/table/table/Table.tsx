import { Flex, Table, TableGlobalFilter, type DataTableFeatures } from '@axonivy/ui-components';
import type { ReactTable, RowData } from '@tanstack/react-table';
import { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import './Table.css';

type TableProps<TData extends RowData> = ComponentProps<typeof Table> & {
  table: ReactTable<DataTableFeatures, TData>;
  searchActive?: boolean;
  onSearchChange?: (filter: string) => void;
};

export const SearchTable = <TData extends RowData>({ table, searchActive, onSearchChange, ...props }: TableProps<TData>) => {
  const { t } = useTranslation();
  return (
    <Flex direction='column' gap={1} style={{ overflow: 'auto' }}>
      <TableGlobalFilter table={table} placeholder={t('common.label.search')} active={searchActive} onChange={onSearchChange} />
      <Table {...props} />
    </Flex>
  );
};
