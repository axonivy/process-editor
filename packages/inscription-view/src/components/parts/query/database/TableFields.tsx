import type { DatabaseColumn } from '@axonivy/process-editor-inscription-protocol';
import { dataTableHelper, SortableHeader, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { flexRender, useTable } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { PathProvider } from '../../../../context/usePath';
import { ScriptCell } from '../../../widgets/table/cell/ScriptCell';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { ValidationRow } from '../../common/path/validation/ValidationRow';
import { useQueryData } from '../useQueryData';

type Column = DatabaseColumn & {
  expression: string;
};

const { columnHelper, tableOptions } = dataTableHelper<Column>();

export const TableFields = () => {
  const { t } = useTranslation();
  const { config, updateSql } = useQueryData();
  const { elementContext: context } = useEditorContext();
  const columnMetas = useMeta('meta/database/columns', { context, database: config.query.dbName, table: config.query.sql.table }, []).data;

  const data = useMemo(() => {
    const fields = config.query.sql.fields ?? {};
    const columnData = columnMetas.map<Column>(c => {
      return { ...c, expression: fields[c.name] ?? '' };
    });
    Object.keys(fields)
      .filter(field => !columnData.find(column => column.name === field))
      .forEach(unknown => columnData.push({ name: unknown, expression: fields[unknown] ?? '', type: '', ivyType: '' }));
    return columnData;
  }, [columnMetas, config.query.sql.fields]);

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
        columnHelper.accessor('expression', {
          header: ({ column }) => <SortableHeader column={column} name={t('common.label.value')} />,
          cell: cell => <ScriptCell cell={cell} type={cell.row.original.ivyType} browsers={['attr', 'func', 'type', 'cms']} />
        })
      ]),
    [t]
  );

  const table = useTable({
    ...tableOptions,
    data,
    columns,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    meta: {
      updateData: (rowId: string, columnId: string, value: unknown) => {
        if (typeof value !== 'string') {
          return;
        }
        const rowIndex = parseInt(rowId);
        const fields: Record<string, string> = {};
        data
          .map((row, index) => {
            if (index === rowIndex && data[rowIndex]) {
              return {
                ...data[rowIndex],
                [columnId]: value
              };
            }
            return row;
          })
          .filter(d => d.expression.length > 0)
          .forEach(d => (fields[d.name] = d.expression));
        updateSql('fields', fields);
      }
    }
  });

  return (
    <PathProvider path='sql'>
      <PathCollapsible
        label={t('part.db.fields')}
        path='fields'
        defaultOpen={config.query.sql.fields && Object.keys(config.query.sql.fields).length > 0}
      >
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow row={row} key={row.id} rowPathSuffix={row.original.name}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </ValidationRow>
            ))}
          </TableBody>
        </Table>
      </PathCollapsible>
    </PathProvider>
  );
};
