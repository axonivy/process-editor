import type { RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import { Flex, TableBody, TableCell, TableRow, useTableKeyHandler } from '@axonivy/ui-components';
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
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoles } from '../../parts/common/role/useRoles';
import { ExpandableCell } from '../../widgets/table/cell/ExpandableCell';
import { SearchTable } from '../../widgets/table/table/Table';
import type { BrowserValue } from '../Browser';
import BrowserTableRow from '../BrowserTableRow';
import type { UseBrowserImplReturnValue } from '../useBrowser';
import { AddRolePopover } from './AddRolePopover';
export const ROLE_BROWSER = 'role' as const;

export type RoleOptions = {
  showTaskRoles?: boolean;
};

export const useRoleBrowser = (onDoubleClick: () => void, options?: RoleOptions): UseBrowserImplReturnValue => {
  const { t } = useTranslation();
  const [value, setValue] = useState<BrowserValue>({ cursorValue: '' });
  return {
    id: ROLE_BROWSER,
    name: t('browser.role.title'),
    content: (
      <RoleBrowser value={value.cursorValue} onChange={setValue} onDoubleClick={onDoubleClick} showtaskRoles={options?.showTaskRoles} />
    ),
    accept: () => value,
    icon: IvyIcons.Users
  };
};

type RoleBrowserProps = {
  value: string;
  showtaskRoles?: boolean;
  onChange: (value: BrowserValue) => void;
  onDoubleClick: () => void;
};

const RoleBrowser = ({ value, showtaskRoles, onChange, onDoubleClick }: RoleBrowserProps) => {
  const { t } = useTranslation();
  const { rolesAsTree: roleItems } = useRoles(showtaskRoles);

  const [showHelper, setShowHelper] = useState(false);

  const columns = useMemo<ColumnDef<RoleMeta, string>[]>(
    () => [
      {
        accessorFn: row => row.id,
        id: 'name',
        cell: cell => {
          return <ExpandableCell cell={cell} title={cell.row.original.id} icon={IvyIcons.User} additionalInfo={cell.row.original.label} />;
        }
      }
    ],
    []
  );

  const [expanded, setExpanded] = useState<ExpandedState>({ [0]: true, [1]: true, [2]: true, [3]: true });
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: roleItems,
    columns: columns,
    state: { expanded, globalFilter, rowSelection },
    filterFromLeafRows: true,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setGlobalFilter,
    getSubRows: row => row.children,
    getExpandedRowModel: getExpandedRowModel(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });
  const { handleKeyDown } = useTableKeyHandler({ table, data: roleItems });

  useEffect(() => {
    const selectedRow = table.getSelectedRowModel().flatRows[0];
    if (selectedRow === undefined) {
      onChange({ cursorValue: '' });
      setShowHelper(false);
      return;
    }

    setShowHelper(true);
    onChange({ cursorValue: selectedRow.original.id });
  }, [onChange, rowSelection, table]);

  const [addedRole, setAddedRoleName] = useState('');

  useEffect(() => {
    if (addedRole.length === 0) {
      return;
    }
    const newRow = table.getRowModel().flatRows.find(row => row.original.id === addedRole);
    if (newRow) {
      newRow.getParentRow()?.toggleExpanded(true);
      setRowSelection({ [newRow.id]: true });
      setAddedRoleName('');
    }
  }, [addedRole, roleItems, table]);

  return (
    <>
      <Flex justifyContent='flex-end'>
        <AddRolePopover value={value} table={table} setAddedRoleName={setAddedRoleName} />
      </Flex>
      <SearchTable
        search={{
          value: globalFilter,
          onChange: newFilterValue => {
            setGlobalFilter(newFilterValue);
            setRowSelection({});
            setExpanded(true);
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
        </pre>
      )}
    </>
  );
};
