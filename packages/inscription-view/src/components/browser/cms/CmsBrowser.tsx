import type { ContentObject, ContentObjectType } from '@axonivy/process-editor-inscription-protocol';
import { Button, Flex, Message, SelectRow, TableBody, TableCell, toast, useTableKeyHandler } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQueryClient } from '@tanstack/react-query';
import type { ColumnDef, ColumnFiltersState, ExpandedState, RowSelectionState, VisibilityState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useFunction } from '../../../context/useFunction';
import { useMeta } from '../../../context/useMeta';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { ExpandableCell } from '../../widgets/table/cell/ExpandableCell';
import { SearchTable } from '../../widgets/table/table/Table';
import type { BrowserValue } from '../Browser';
import type { UseBrowserImplReturnValue } from '../useBrowser';

export const CMS_BROWSER_ID = 'cms' as const;

export type CmsTypeFilter = 'STRING' | 'FILE' | 'NONE';

export type CmsOptions = {
  noApiCall?: boolean;
  typeFilter?: CmsTypeFilter;
};

export const useCmsBrowser = (
  onDoubleClick: () => void,
  location: string,
  setDisableApply: (value: boolean) => void,
  options?: CmsOptions
): UseBrowserImplReturnValue => {
  const { t } = useTranslation();
  const [value, setValue] = useState<BrowserValue>({ cursorValue: '' });

  return {
    id: CMS_BROWSER_ID,
    name: t('browser.cms.title'),
    content: (
      <CmsBrowser
        value={value.cursorValue}
        onChange={setValue}
        noApiCall={options?.noApiCall}
        typeFilter={options?.typeFilter}
        onDoubleClick={onDoubleClick}
        location={location}
        setDisableApply={setDisableApply}
      />
    ),
    accept: () => value,
    icon: IvyIcons.Cms
  };
};

interface CmsBrowserProps {
  value: string;
  onChange: (value: BrowserValue) => void;
  onDoubleClick: () => void;
  setDisableApply: (value: boolean) => void;
  location: string;
  noApiCall?: boolean;
  typeFilter?: CmsTypeFilter;
}

const CmsBrowser = ({ value, onChange, noApiCall, typeFilter, onDoubleClick, location, setDisableApply }: CmsBrowserProps) => {
  const { t } = useTranslation();
  const { context } = useEditorContext();

  const [requiredProject, setRequiredProject] = useState<boolean>(false);
  const { data: tree } = useMeta('meta/cms/tree', { context, requiredProjects: requiredProject }, []);

  const [selectedContentObject, setSelectedContentObject] = useState<ContentObject | undefined>();
  const [showHelper, setShowHelper] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const addNewCmsString = useFunction(
    'meta/cms/newCmsString',
    {
      context,
      parentUri: ''
    },
    {
      onSuccess: () => {
        toast.info(t('browser.cms.addSuccess'));
        queryClient.invalidateQueries({ queryKey: ['meta/cms/tree', { context, requiredProjects: requiredProject }] });
      },
      onError: error => {
        toast.error(t('browser.cms.addFailed'), { description: error.message });
      }
    }
  );

  const columns = useMemo<ColumnDef<ContentObject, string>[]>(
    () => [
      {
        accessorFn: row => row.name,
        id: 'name',
        cell: cell => {
          return (
            <ExpandableCell
              cell={cell}
              title={cell.row.original.name}
              icon={
                cell.row.original.type === 'FOLDER'
                  ? IvyIcons.FolderOpen
                  : cell.row.original.type === 'FILE'
                    ? IvyIcons.File
                    : IvyIcons.ChangeType
              }
              additionalInfo={cell.row.original.type}
            />
          );
        }
      },
      {
        accessorFn: row => row.type,
        id: 'type',
        cell: cell => <span title={cell.row.original.type}>{cell.getValue() as string}</span>
      },
      {
        accessorFn: row => JSON.stringify(row.values),
        id: 'values',
        cell: cell => <span title={JSON.stringify(cell.row.original.values)}>{JSON.stringify(cell.getValue())}</span>
      }
    ],
    []
  );

  const [expanded, setExpanded] = useState<ExpandedState>(false as ExpandedState);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({ type: false, values: false });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    typeFilter === 'NONE' || typeFilter === undefined ? [] : [{ id: 'type', value: typeFilter }]
  );

  const table = useReactTable({
    data: tree,
    columns: columns,
    state: {
      expanded,
      globalFilter,
      rowSelection,
      columnFilters,
      columnVisibility
    },
    filterFromLeafRows: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getSubRows: row => row.children,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility
  });
  const { handleKeyDown } = useTableKeyHandler({ table, data: tree });
  useEffect(() => {
    const addIvyPathToValue = (value: string, type: ContentObjectType, noApiCall?: boolean) => {
      if (noApiCall || value.length === 0) {
        return value;
      }
      if (type === 'FOLDER') {
        return value;
      }
      if (type === 'FILE' && location === 'attachments') {
        return `ivy.cm.findObject("${value}")`;
      } else if (type === 'FILE' && location !== 'message') {
        return `ivy.cms.cr("${value}")`;
      }
      return `ivy.cms.co("${value}")`;
    };

    const selectedRow = table.getSelectedRowModel().flatRows[0];
    if (selectedRow === undefined) {
      setSelectedContentObject({ name: '', children: [], fullPath: '', type: 'STRING', values: {} });
      setShowHelper(false);
      onChange({ cursorValue: '' });
      return;
    }
    setSelectedContentObject(selectedRow.original);
    setShowHelper(true);
    onChange({ cursorValue: addIvyPathToValue(selectedRow.original.fullPath, selectedRow.original.type, noApiCall) });
  }, [onChange, rowSelection, noApiCall, table, location]);

  const folderSelected = () => table.getSelectedRowModel().flatRows[0]?.original.type === 'FOLDER';

  return (
    <>
      <Flex direction='row' justifyContent='space-between' alignItems='center'>
        <Checkbox label={t('browser.cms.requiredProjects')} value={requiredProject} onChange={() => setRequiredProject(!requiredProject)} />
        {context.app === 'designer' && (
          <Button
            icon={IvyIcons.Plus}
            onClick={() => addNewCmsString.mutate({ context, parentUri: table.getSelectedRowModel().flatRows[0]?.original.fullPath ?? '' })}
            aria-label={t('browser.cms.add')}
            title={t('browser.cms.add')}
            disabled={
              table.getSelectedRowModel().flatRows.length === 0 ||
              requiredProject ||
              table.getSelectedRowModel().flatRows[0]?.original.type !== 'FOLDER'
            }
          />
        )}
      </Flex>

      <SearchTable
        search={{
          value: globalFilter,
          onChange: newFilterValue => {
            setGlobalFilter(newFilterValue);
            setExpanded(true);
          }
        }}
        onKeyDown={e => handleKeyDown(e, onDoubleClick)}
      >
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <SelectRow
              key={row.id}
              row={row}
              onDoubleClick={folderSelected() ? undefined : onDoubleClick}
              onClick={() => (row.original.type === 'FOLDER' ? setDisableApply(true) : setDisableApply(false))}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
              <TableCell />
            </SelectRow>
          ))}
        </TableBody>
      </SearchTable>
      {showHelper &&
        (value.length !== 0 && selectedContentObject ? (
          <pre className='browser-helptext'>
            <b>{value}</b>
            <code>
              {Object.entries(selectedContentObject.values).map(([key, value]) => (
                <div key={key}>
                  <b>{`${key}: `}</b>
                  {value}
                </div>
              ))}
            </code>
          </pre>
        ) : (
          <pre className='browser-helptext'>
            <Message message={t('browser.emptyInfo')} variant='info' />
          </pre>
        ))}
    </>
  );
};
