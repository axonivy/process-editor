import type { ColumnDef, Row, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useQueryData } from '../useQueryData';
import { useEffect, useMemo, useState } from 'react';
import type { DatabaseColumn } from '@axonivy/process-editor-inscription-protocol';
import { SortableHeader, Table, TableBody, TableCell, TableResizableHeader, TableRow } from '@axonivy/ui-components';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import Checkbox from '../../../widgets/checkbox/Checkbox';

type Column = Omit<DatabaseColumn, 'ivyType'> & {
  selected: boolean;
};

export const TableReadFields = () => {
  const { config, updateSql } = useQueryData();
  const selectAll = !config.query.sql.select || (config.query.sql.select?.length === 1 && config.query.sql.select[0] === '*');

  const { elementContext: context } = useEditorContext();
  const columnMetas = useMeta('meta/database/columns', { context, database: config.query.dbName, table: config.query.sql.table }, []).data;

  const [data, setData] = useState<Column[]>([]);

  useEffect(() => {
    const select = config.query.sql.select ?? [];
    const columnData = columnMetas.map<Column>(c => {
      return { ...c, selected: select.includes(c.name) };
    });
    setData(columnData);
  }, [columnMetas, config.query.sql.select]);

  const columns = useMemo<ColumnDef<Column>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name='Column' />,
        cell: cell => (
          <>
            <span>{cell.getValue() as string}</span>
            <span className='row-expand-label-info'> : {cell.row.original.type}</span>
          </>
        )
      },
      {
        accessorKey: 'selected',
        header: ({ column }) => <SortableHeader column={column} name='Read' />,
        cell: cell => <span>{(cell.getValue() as boolean) ? '✅' : ''}</span>
      }
    ],
    []
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const selectRow = (row: Row<Column>) => {
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
    <PathCollapsible label='Fields' path='fields' defaultOpen={!selectAll}>
      <Checkbox label='Select all fields' value={selectAll} onChange={() => updateSql('select', selectAll ? [] : ['*'])} />
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
