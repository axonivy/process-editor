import type { Function } from '@axonivy/process-editor-inscription-protocol';
import { TableBody, TableFooter, useTableKeyHandler } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type RowSelectionState
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { ExpandableCell } from '../../widgets/table/cell/ExpandableCell';
import { TableShowMore } from '../../widgets/table/footer/TableFooter';
import { SearchTable } from '../../widgets/table/table/Table';
import type { BrowserValue } from '../Browser';
import BrowserTableRow from '../BrowserTableRow';
import type { UseBrowserImplReturnValue } from '../useBrowser';
import { getParentNames } from './parent-name';
export const FUNCTION_BROWSER_ID = 'func' as const;

export const useFuncBrowser = (onDoubleClick: () => void): UseBrowserImplReturnValue => {
  const { t } = useTranslation();
  const [value, setValue] = useState<BrowserValue>({ cursorValue: '' });
  return {
    id: FUNCTION_BROWSER_ID,
    name: t('browser.function.title'),
    content: <FunctionBrowser value={value.cursorValue} onChange={setValue} onDoubleClick={onDoubleClick} />,
    accept: () => value,
    icon: IvyIcons.Function
  };
};

type FunctionBrowserProps = {
  value: string;
  onChange: (value: BrowserValue) => void;
  onDoubleClick: () => void;
};

const FunctionBrowser = ({ value, onChange, onDoubleClick }: FunctionBrowserProps) => {
  const { t } = useTranslation();
  const { context } = useEditorContext();
  const [method, setMethod] = useState('');
  const [paramTypes, setParamTypes] = useState<string[]>([]);
  const [type, setType] = useState('');
  const { data: tree } = useMeta('meta/scripting/functions', undefined, []);
  const { data: doc } = useMeta('meta/scripting/apiDoc', { context, method, paramTypes, type }, '');
  const sortedTree = useMemo(() => {
    if (!tree || tree.length === 0) {
      return [];
    }

    const sortedReturnTypes = tree
      .map(entry => entry.returnType)
      .filter(returnType => returnType)
      .map(returnType => ({
        ...returnType,
        functions: returnType.functions.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }))
      }));

    return tree.map<Function>((entry, index) => ({
      ...entry,
      returnType: sortedReturnTypes[index] ?? entry.returnType
    }));
  }, [tree]);

  const [rowNumber, setRowNumber] = useState(100);

  const [selectedFunctionDoc, setSelectedFunctionDoc] = useState('');
  const [showHelper, setShowHelper] = useState(false);

  const columns = useMemo<ColumnDef<Function, string>[]>(
    () => [
      {
        accessorFn: row =>
          `${row.name.split('.').pop()}${
            row.isField === false ? `(${row.params.map(param => param.type.split('.').pop()).join(', ')})` : ''
          }`,
        id: 'name',
        cell: cell => {
          return (
            <ExpandableCell
              cell={cell}
              title={cell.row.original.name}
              icon={cell.row.original.isField ? IvyIcons.FolderOpen : IvyIcons.Function}
              additionalInfo={cell.row.original.returnType ? cell.row.original.returnType.simpleName : t('browser.function.noType')}
            />
          );
        }
      }
    ],
    [t]
  );

  const [expanded, setExpanded] = useState<ExpandedState>({ [0]: true });
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: sortedTree,
    columns: columns,
    state: {
      expanded,
      globalFilter,
      rowSelection
    },
    filterFromLeafRows: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getSubRows: row => (row.returnType ? row.returnType.functions : []),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });
  const { handleKeyDown } = useTableKeyHandler({ table, data: sortedTree });
  const { rows } = table.getRowModel();
  const parentRef = useRef<HTMLTableElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length > 0 ? Math.min(rows.length, rowNumber) : 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 30,
    overscan: 20
  });

  useEffect(() => {
    const selectedRow = table.getSelectedRowModel().flatRows[0];
    if (selectedRow === undefined) {
      setShowHelper(false);
      onChange({ cursorValue: '' });
      return;
    }
    //setup correct functionName for the accept-method
    const parentNames = getParentNames(selectedRow);
    const selectedName = parentNames.reverse().join('.');
    onChange({ cursorValue: selectedName });

    //setup Meta-Call for docApi
    const parentRow = selectedRow.getParentRow();
    setType(
      parentRow
        ? parentRow.original.returnType.packageName + '.' + parentRow.original.returnType.simpleName
        : selectedRow.original.returnType.packageName + '.' + selectedRow.original.returnType.simpleName
    );
    setMethod(selectedRow.original.name);
    setParamTypes(selectedRow.original.params.map(param => param.type));
    //setup Helpertext
    setSelectedFunctionDoc(doc);
    setShowHelper(true);
  }, [doc, onChange, rowSelection, table]);

  return (
    <>
      <SearchTable
        search={{
          value: globalFilter,
          onChange: newFilterValue => {
            setGlobalFilter(newFilterValue);
            setExpanded(newFilterValue.length > 0 ? true : { [0]: true });
            setRowSelection({});
            setRowNumber(100);
          }
        }}
        onKeyDown={e => handleKeyDown(e, onDoubleClick)}
        ref={parentRef}
      >
        <TableBody>
          {rows.some(row => row.depth === 1 && row.getIsExpanded())
            ? virtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index];
                if (row === undefined) {
                  return null;
                }
                return <BrowserTableRow key={row.id} row={row} onDoubleClick={onDoubleClick} />;
              })
            : table.getRowModel().rows.map(row => <BrowserTableRow key={row.id} row={row} onDoubleClick={onDoubleClick} />)}
        </TableBody>
        {rowNumber < rows.length && (
          <TableFooter>
            <TableShowMore
              colSpan={columns.length}
              showMore={() => setRowNumber(old => old + 100)}
              helpertext={t('browser.function.loadMore', { rowNumber, rowCount: rows.length })}
            />
          </TableFooter>
        )}
      </SearchTable>
      {showHelper && <pre className='browser-helptext' dangerouslySetInnerHTML={{ __html: `<b>${value}</b>${selectedFunctionDoc}` }} />}
    </>
  );
};
