import type { DatabaseColumn } from '@axonivy/process-editor-inscription-protocol';
import {
  type DataTableFeatures,
  dataTableHelper,
  SortableHeader,
  Table,
  TableBody,
  TableCell,
  TableResizableHeader,
  TableRow
} from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';
import { flexRender, useTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import Checkbox from '../../../widgets/checkbox/Checkbox';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { useQueryData } from '../useQueryData';

type Column = Omit<DatabaseColumn, 'ivyType'> & {
  selected: boolean;
};

const { columnHelper, tableOptions } = dataTableHelper<Column>();

export const TableReadFields = () => {
  const { t } = useTranslation();
  const { config, updateSql } = useQueryData();
  const selectAll = !config.query.sql.select || (config.query.sql.select?.length === 1 && config.query.sql.select[0] === '*');
  const { elementContext: context } = useEditorContext();
  const columnMetas = useMeta('meta/database/columns', { context, database: config.query.dbName, table: config.query.sql.table }, []).data;

  const data = useMemo(() => {
    const select = config.query.sql.select ?? [];
    return columnMetas.map<Column>(c => ({ ...c, selected: select.includes(c.name) }));
  }, [columnMetas, config.query.sql.select]);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('name', {
          header: ({ column }) => <SortableHeader column={column} name={t('label.column')} />,
          cell: cell => (
            <>
              <span>{cell.getValue()}</span>
              <span className='row-expand-label-info'> : {cell.row.original.type}</span>
            </>
          )
        }),
        columnHelper.accessor('selected', {
          header: ({ column }) => <SortableHeader column={column} name={t('part.db.read')} />,
          cell: cell => <span>{(cell.getValue() as boolean) ? '✅' : ''}</span>
        })
      ]),
    [t]
  );

  const table = useTable({
    ...tableOptions,
    data,
    columns,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr'
  });

  const selectRow = (row: Row<DataTableFeatures, Column>) => {
    const column = row.original.name;
    const select = data.filter(c => c.selected).map(c => c.name);
    const index = select.indexOf(column);
    if (index > -1) {
      select.splice(index, 1);
    } else {
      select.push(column);
    }
    updateSql('select', select);
  };

  return (
    <PathCollapsible label={t('part.db.fields')} path='fields' defaultOpen={!selectAll}>
      <Checkbox label={t('part.db.selectAllFields')} value={selectAll} onChange={() => updateSql('select', selectAll ? [] : ['*'])} />
      {!selectAll && (
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id} onClick={() => selectRow(row)}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PathCollapsible>
  );
};
