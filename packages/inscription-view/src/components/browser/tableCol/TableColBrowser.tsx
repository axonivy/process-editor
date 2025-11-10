import { useEffect, useMemo, useState } from 'react';
import type { BrowserValue, UseBrowserImplReturnValue } from '../useBrowser';
import { IvyIcons } from '@axonivy/ui-icons';
import { useReactTable, type ColumnDef, type RowSelectionState, getCoreRowModel, getFilteredRowModel } from '@tanstack/react-table';
import { useQueryData } from '../../parts/query/useQueryData';
import type { DatabaseColumn } from '@axonivy/process-editor-inscription-protocol';
import { TableBody, TableCell, TableRow, useTableKeyHandler } from '@axonivy/ui-components';
import BrowserTableRow from '../BrowserTableRow';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { SearchTable } from '../../widgets/table/table/Table';
export const TABLE_COL_BROWSER_ID = 'tablecol' as const;

export const useTableColBrowser = (onDoubleClick: () => void): UseBrowserImplReturnValue => {
  const [value, setValue] = useState<BrowserValue>({ value: '' });
  return {
    id: TABLE_COL_BROWSER_ID,
    name: 'Table Column',
    content: <TableColumnBrowser value={value.value} onChange={setValue} onDoubleClick={onDoubleClick} />,
    accept: () => value,
    icon: IvyIcons.Rule
  };
};

const TableColumnBrowser = (props: { value: string; onChange: (value: BrowserValue) => void; onDoubleClick: () => void }) => {
  const { elementContext: context } = useEditorContext();
  const { config } = useQueryData();

  const columnMetas = useMeta('meta/database/columns', { context, database: config.query.dbName, table: config.query.sql.table }, []).data;

  const [data, setData] = useState<DatabaseColumn[]>([]);

  const [showHelper, setShowHelper] = useState(false);

  useEffect(() => {
    const select = config.query.sql.select ?? [];
    let columns = columnMetas;
    if (select.length > 1 || select[0] !== '*') {
      columns = columnMetas.filter(c => select.includes(c.name));
    }
    setData(columns);
  }, [columnMetas, config.query.sql.select]);

  const columns = useMemo<ColumnDef<DatabaseColumn>[]>(
    () => [
      {
        accessorFn: row => row.name,
        id: 'name',
        cell: cell => {
          return (
            <>
              <span>{cell.getValue() as string}</span>
              <span className='row-expand-label-info'>: {cell.row.original.type}</span>
            </>
          );
        }
      }
    ],
    []
  );

  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: data,
    columns: columns,
    state: {
      globalFilter,
      rowSelection
    },
    filterFromLeafRows: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });
  const { handleKeyDown } = useTableKeyHandler({ table, data });
  useEffect(() => {
    if (Object.keys(rowSelection).length !== 1) {
      props.onChange({ value: '' });
      setShowHelper(false);
      return;
    }

    const selectedRow = table.getRowModel().rowsById[Object.keys(rowSelection)[0]];
    setShowHelper(true);
    props.onChange({ value: selectedRow.original.name, data: selectedRow.original });
  }, [props, rowSelection, table]);

  return (
    <>
      <SearchTable
        search={{
          value: globalFilter,
          onChange: newFilterValue => {
            setGlobalFilter(newFilterValue);
          }
        }}
        onKeyDown={e => handleKeyDown(e, props.onDoubleClick)}
      >
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => <BrowserTableRow key={row.id} row={row} onDoubleClick={props.onDoubleClick} />)
          ) : (
            <TableRow>
              <TableCell>No Columns found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </SearchTable>
      {showHelper && (
        <pre className='browser-helptext'>
          <b>{props.value}</b>
          <>{table.getRowModel().rowsById[Object.keys(rowSelection)[0]].original.type}</>
        </pre>
      )}
    </>
  );
};
