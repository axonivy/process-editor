import type { DataclassType } from '@axonivy/process-editor-inscription-protocol';
import { dataTreeHelper, TableBody, TableCell, useTableKeyHandler, type BrowserNode, type DataTableFeatures } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { FilterFn } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import DOMPurify from 'dompurify';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { ExpandableCell } from '../../widgets/table/cell/ExpandableCell';
import { SearchTable } from '../../widgets/table/table/Table';
import BrowserTableRow from '../BrowserTableRow';
import type { BrowserValue, UseBrowserImplReturnValue } from '../useBrowser';
import { getCursorValue } from './cursor-value';
import { useTypeData } from './type-data';

export const TYPE_BROWSER_ID = 'type' as const;

export const useTypeBrowser = (onDoubleClick: () => void, initSearchFilter: () => string, location: string): UseBrowserImplReturnValue => {
  const { t } = useTranslation();
  const [value, setValue] = useState<BrowserValue>({ value: '' });
  return {
    id: TYPE_BROWSER_ID,
    name: t('browser.type.title'),
    content: (
      <TypeBrowser
        value={value.value}
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

const { columnHelper, tableOptions } = dataTreeHelper<BrowserNode<DataclassType>>();

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

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('value', {
          cell: cell => (
            <ExpandableCell
              cell={cell}
              title={cell.row.original.value}
              additionalInfo={cell.row.original.info}
              icon={cell.row.original.icon}
            />
          )
        })
      ]),
    []
  );

  const regexFilter: FilterFn<DataTableFeatures, BrowserNode<DataclassType>> = (row, _columnId, filterValue) => {
    const cellValue = row.original.value || '';
    const regexPattern = new RegExp(filterValue.replace(/\*/g, '.*'), 'i');
    return regexPattern.test(cellValue);
  };

  const table = useTable({
    ...tableOptions,
    data: types,
    columns: columns,
    initialState: {
      globalFilter: initSearchFilter,
      expanded: true
    },
    globalFilterFn: regexFilter,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    enableFilters: true
  });

  const { handleKeyDown } = useTableKeyHandler({ table, data: types });

  const updateChange = useCallback(
    (typeAsList: boolean) => {
      const selectedRow = table.getSelectedRowModel().flatRows[0];
      if (selectedRow === undefined) {
        onChange({ value: '' });

        setShowHelper(false);
        return;
      }

      setShowHelper(true);
      const isIvyType = ivyTypes.some(javaClass => javaClass.fullQualifiedName === selectedRow.original.data?.fullQualifiedName);

      setType(selectedRow.original.data?.fullQualifiedName ?? '');

      if (location.includes('code')) {
        onChange({
          value: getCursorValue(selectedRow.original, isIvyType, typeAsList, true),
          firstLine: isIvyType ? undefined : 'import ' + selectedRow.original.data?.fullQualifiedName + ';\n'
        });
      } else {
        onChange({
          value: getCursorValue(selectedRow.original, isIvyType, typeAsList, false)
        });
      }
    },
    [ivyTypes, location, onChange, table]
  );

  useEffect(() => {
    const subscription = table.atoms.rowSelection.subscribe(() => updateChange(typeAsList));
    return () => subscription.unsubscribe();
  }, [table.atoms.rowSelection, updateChange, typeAsList]);

  useEffect(() => {
    table.atoms.globalFilter.subscribe(() => {
      const timer = setTimeout(() => {
        setMainFilter(table.atoms.globalFilter.get());
        table.setExpanded(true);
      }, 150);

      return () => clearTimeout(timer);
    });
  }, [table]);

  return (
    <>
      <div className='browser-table-header'>
        <Checkbox
          label={t('browser.type.searchAllTypes')}
          value={allTypesSearchActive}
          onChange={() => {
            setAllTypesSearchActive(!allTypesSearchActive);
            table.setRowSelection({});
          }}
        />
      </div>
      <SearchTable table={table} onSearchChange={() => table.setRowSelection({})} onKeyDown={e => handleKeyDown(e, onDoubleClick)}>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            <>
              {!isFetching && table.getRowModel().rows.map(row => <BrowserTableRow key={row.id} row={row} onDoubleClick={onDoubleClick} />)}
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
          {/* eslint-disable-next-line @eslint-react/dom-no-dangerously-set-innerhtml */}
          <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(doc) }}></span>
        </pre>
      )}
      <Checkbox
        label={t('browser.type.asList')}
        value={typeAsList}
        onChange={() => {
          setTypeAsList(!typeAsList);
          updateChange(!typeAsList);
        }}
      />
    </>
  );
};
