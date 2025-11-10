import { useEffect, useMemo, useRef, useState } from 'react';
import type { BrowserValue, UseBrowserImplReturnValue } from '../useBrowser';
import type { Function } from '@axonivy/process-editor-inscription-protocol';
import {
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type RowSelectionState,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IvyIcons } from '@axonivy/ui-icons';
import { getParentNames } from './parent-name';
import { TableBody, TableFooter, useTableKeyHandler } from '@axonivy/ui-components';
import BrowserTableRow from '../BrowserTableRow';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { ExpandableCell } from '../../widgets/table/cell/ExpandableCell';
import { SearchTable } from '../../widgets/table/table/Table';
import { TableShowMore } from '../../widgets/table/footer/TableFooter';
export const FUNCTION_BROWSER_ID = 'func' as const;

export const useFuncBrowser = (onDoubleClick: () => void): UseBrowserImplReturnValue => {
  const [value, setValue] = useState<BrowserValue>({ value: '' });
  return {
    id: FUNCTION_BROWSER_ID,
    name: 'Function',
    content: <FunctionBrowser value={value.value} onChange={setValue} onDoubleClick={onDoubleClick} />,
    accept: () => value,
    icon: IvyIcons.Function
  };
};

const FunctionBrowser = (props: { value: string; onChange: (value: BrowserValue) => void; onDoubleClick: () => void }) => {
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

    return tree.map((entry, index) => ({
      ...entry,
      returnType: sortedReturnTypes[index]
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
              additionalInfo={cell.row.original.returnType ? cell.row.original.returnType.simpleName : 'no return type defined'}
            />
          );
        }
      }
    ],
    []
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
    if (Object.keys(rowSelection).length !== 1) {
      setShowHelper(false);
      props.onChange({ value: '' });
      return;
    }
    const selectedRow = table.getRowModel().rowsById[Object.keys(rowSelection)[0]];
    //setup correct functionName for the accept-method
    const parentNames = getParentNames(selectedRow);
    const selectedName = parentNames.reverse().join('.');
    props.onChange({ value: selectedName });

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
  }, [doc, props, rowSelection, table]);

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
        onKeyDown={e => handleKeyDown(e, props.onDoubleClick)}
        ref={parentRef}
      >
        <TableBody>
          {rows.some(row => row.depth === 1 && row.getIsExpanded())
            ? virtualizer.getVirtualItems().map(virtualRow => {
                const row = rows[virtualRow.index];
                return <BrowserTableRow key={row.id} row={row} onDoubleClick={props.onDoubleClick} />;
              })
            : table.getRowModel().rows.map(row => <BrowserTableRow key={row.id} row={row} onDoubleClick={props.onDoubleClick} />)}
        </TableBody>
        {rowNumber < rows.length && (
          <TableFooter>
            <TableShowMore
              colSpan={columns.length}
              showMore={() => setRowNumber(old => old + 100)}
              helpertext={rowNumber + ' out of ' + rows.length + ' shown'}
            />
          </TableFooter>
        )}
      </SearchTable>
      {showHelper && (
        <pre className='browser-helptext' dangerouslySetInnerHTML={{ __html: `<b>${props.value}</b>${selectedFunctionDoc}` }} />
      )}
    </>
  );
};
