import type { DatabaseColumn } from '@axonivy/process-editor-inscription-protocol';
import { TableBody, TableCell, TableRow, useTableKeyHandler } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { getCoreRowModel, getFilteredRowModel, useReactTable, type ColumnDef, type RowSelectionState } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { useQueryData } from '../../parts/query/useQueryData';
import { SearchTable } from '../../widgets/table/table/Table';
import BrowserTableRow from '../BrowserTableRow';
import type { BrowserValue, UseBrowserImplReturnValue } from '../useBrowser';

export const TABLE_COL_BROWSER_ID = 'tablecol' as const;

export const useTableColBrowser = (onDoubleClick: () => void): UseBrowserImplReturnValue => {
  const { t } = useTranslation();
  const [value, setValue] = useState<BrowserValue>({ value: '' });
  return {
    id: TABLE_COL_BROWSER_ID,
    name: t('browser.tableCol.title'),
    content: <TableColumnBrowser value={value.value} onChange={setValue} onDoubleClick={onDoubleClick} />,
    accept: () => value,
    icon: IvyIcons.Rule
  };
};

type TableColumnBrowserProps = {
  value: string;
  onChange: (value: BrowserValue) => void;
  onDoubleClick: () => void;
};

const TableColumnBrowser = ({ value, onChange, onDoubleClick }: TableColumnBrowserProps) => {
  const { t } = useTranslation();
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
    const selectedRow = table.getSelectedRowModel().flatRows[0];
    if (selectedRow === undefined) {
      onChange({ value: '' });
      setShowHelper(false);
      return;
    }

    setShowHelper(true);
    onChange({ value: selectedRow.original.name, data: selectedRow.original });
  }, [onChange, rowSelection, table]);

  return (
    <>
      <SearchTable
        search={{
          value: globalFilter,
          onChange: newFilterValue => {
            setGlobalFilter(newFilterValue);
          }
        }}
        onKeyDown={e => handleKeyDown(e, onDoubleClick)}
      >
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => <BrowserTableRow key={row.id} row={row} onDoubleClick={onDoubleClick} />)
          ) : (
            <TableRow>
              <TableCell>{t('browser.empty')}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </SearchTable>
      {showHelper && (
        <pre className='browser-helptext'>
          <b>{value}</b>
          <>{table.getSelectedRowModel().rows[0]?.original.type}</>
        </pre>
      )}
    </>
  );
};
