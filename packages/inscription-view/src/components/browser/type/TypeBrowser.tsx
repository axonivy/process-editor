import type { DataclassType } from '@axonivy/process-editor-inscription-protocol';
import { TableBody, TableCell, useTableKeyHandler, type BrowserNode } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef, ExpandedState, FilterFn, RowSelectionState } from '@tanstack/react-table';
import { getCoreRowModel, getExpandedRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { ExpandableCell } from '../../widgets/table/cell/ExpandableCell';
import { SearchTable } from '../../widgets/table/table/Table';
import type { BrowserValue } from '../Browser';
import BrowserTableRow from '../BrowserTableRow';
import type { UseBrowserImplReturnValue } from '../useBrowser';
import { getCursorValue } from './cursor-value';
import { useTypeData } from './type-data';
export const TYPE_BROWSER_ID = 'type' as const;

export const useTypeBrowser = (onDoubleClick: () => void, initSearchFilter: () => string, location: string): UseBrowserImplReturnValue => {
  const { t } = useTranslation();
  const [value, setValue] = useState<BrowserValue>({ cursorValue: '' });
  return {
    id: TYPE_BROWSER_ID,
    name: t('browser.type.title'),
    content: (
      <TypeBrowser
        value={value.cursorValue}
        onChange={setValue}
        onDoubleClick={onDoubleClick}
        location={location}
        initSearchFilter={initSearchFilter}
      />
    ),
    accept: () => value,
    icon: IvyIcons.DataClass
  };
};

interface TypeBrowserProps {
  value: string;
  onChange: (value: BrowserValue) => void;
  onDoubleClick: () => void;
  initSearchFilter: () => string;
  location: string;
}

const TypeBrowser = ({ value, onChange, onDoubleClick, initSearchFilter, location }: TypeBrowserProps) => {
  const { t } = useTranslation();
  const { context } = useEditorContext();
  const [allTypesSearchActive, setAllTypesSearchActive] = useState(false);
  const [mainFilter, setMainFilter] = useState('');

  const dataClasses = useMeta('meta/scripting/dataClasses', context, []).data;
  const ivyTypes = useMeta('meta/scripting/ivyTypes', undefined, []).data;

  const ownTypes = useMeta('meta/scripting/ownTypes', { context, limit: 100, type: '' }, [], { disable: allTypesSearchActive }).data;
  const { data: allDatatypes, isFetching } = useMeta('meta/scripting/allTypes', { context, limit: 150, type: mainFilter }, [], {
    disable: !allTypesSearchActive
  });

  const types = useTypeData(dataClasses, ivyTypes, ownTypes, allDatatypes, allTypesSearchActive);

  const [typeAsList, setTypeAsList] = useState(false);

  const [showHelper, setShowHelper] = useState(false);

  const [type, setType] = useState('');
  const { data: doc } = useMeta('meta/scripting/apiDoc', { context, method: '', paramTypes: [], type }, '');

  const columns = useMemo<ColumnDef<BrowserNode<DataclassType>, string>[]>(
    () => [
      {
        accessorKey: 'value',
        cell: cell => (
          <ExpandableCell
            cell={cell}
            title={cell.row.original.value}
            additionalInfo={cell.row.original.info}
            icon={cell.row.original.icon}
          />
        )
      }
    ],
    []
  );

  const [expanded, setExpanded] = useState<ExpandedState>(true);
  const [globalFilter, setGlobalFilter] = useState(initSearchFilter);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const regexFilter: FilterFn<BrowserNode<DataclassType>> = (row, columnId, filterValue) => {
    const cellValue = row.original.value || '';
    const regexPattern = new RegExp(filterValue.replace(/\*/g, '.*'), 'i');
    return regexPattern.test(cellValue);
  };

  const tableDynamic = useReactTable({
    data: types,
    columns: columns,
    state: {
      expanded,
      globalFilter,
      rowSelection
    },
    globalFilterFn: regexFilter,
    filterFromLeafRows: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    enableFilters: true,
    onExpandedChange: setExpanded,
    getSubRows: row => row.children,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  const { handleKeyDown } = useTableKeyHandler({ table: tableDynamic, data: types });

  useEffect(() => {
    const selectedRow = tableDynamic.getSelectedRowModel().flatRows[0];
    if (selectedRow === undefined) {
      onChange({ cursorValue: '' });
      setShowHelper(false);
      return;
    }

    setShowHelper(true);
    const isIvyType = ivyTypes.some(javaClass => javaClass.fullQualifiedName === selectedRow.original.data?.fullQualifiedName);

    setType(selectedRow.original.data?.fullQualifiedName ?? '');

    if (location.includes('code')) {
      onChange({
        cursorValue: getCursorValue(selectedRow.original, isIvyType, typeAsList, true),
        firstLineValue: isIvyType ? undefined : 'import ' + selectedRow.original.data?.fullQualifiedName + ';\n'
      });
    } else {
      onChange({
        cursorValue: getCursorValue(selectedRow.original, isIvyType, typeAsList, false)
      });
    }
  }, [ivyTypes, location, onChange, rowSelection, tableDynamic, typeAsList]);

  const [debouncedFilterValue, setDebouncedFilterValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilterValue(globalFilter);
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [globalFilter]);

  useEffect(() => {
    if (debouncedFilterValue.length > 0) {
      setMainFilter(debouncedFilterValue);
    } else {
      setMainFilter('');
    }
    setExpanded(true);
  }, [debouncedFilterValue]);

  return (
    <>
      <div className='browser-table-header'>
        <Checkbox
          label={t('browser.type.searchAllTypes')}
          value={allTypesSearchActive}
          onChange={() => {
            setAllTypesSearchActive(!allTypesSearchActive);
            setRowSelection({});
          }}
        />
      </div>
      <SearchTable
        search={{
          value: globalFilter,
          onChange: newFilterValue => {
            setGlobalFilter(newFilterValue);
            setRowSelection({});
          }
        }}
        onKeyDown={e => handleKeyDown(e, onDoubleClick)}
      >
        <TableBody>
          {tableDynamic.getRowModel().rows.length > 0 ? (
            <>
              {!isFetching &&
                tableDynamic.getRowModel().rows.map(row => <BrowserTableRow key={row.id} row={row} onDoubleClick={onDoubleClick} />)}
            </>
          ) : (
            <tr>
              <TableCell>{t('browser.type.empty')}</TableCell>
            </tr>
          )}
        </TableBody>
      </SearchTable>
      {isFetching && (
        <div className='loader-message'>
          <p>{t('browser.type.loadingTypes')}</p>
        </div>
      )}
      {showHelper && (
        <pre className='browser-helptext'>
          <b>{value}</b>
          <span dangerouslySetInnerHTML={{ __html: `${doc}` }}></span>
        </pre>
      )}
      <Checkbox label={t('browser.type.asList')} value={typeAsList} onChange={() => setTypeAsList(!typeAsList)} />
    </>
  );
};
