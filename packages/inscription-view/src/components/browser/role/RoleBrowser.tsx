import { useEffect, useMemo, useState } from 'react';
import type { BrowserValue, UseBrowserImplReturnValue } from '../useBrowser';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  useReactTable,
  type ColumnDef,
  type RowSelectionState,
  getCoreRowModel,
  getFilteredRowModel,
  type ExpandedState,
  getExpandedRowModel
} from '@tanstack/react-table';
import { useRoles } from '../../parts/common/responsible/useRoles';
import type { RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import { Flex, TableBody, TableCell, TableRow, useTableKeyHandler } from '@axonivy/ui-components';
import { AddRolePopover } from './AddRolePopover';
import BrowserTableRow from '../BrowserTableRow';
import { ExpandableCell } from '../../widgets/table/cell/ExpandableCell';
import { SearchTable } from '../../widgets/table/table/Table';
export const ROLE_BROWSER = 'role' as const;

export type RoleOptions = {
  showTaskRoles?: boolean;
};

export const useRoleBrowser = (onDoubleClick: () => void, options?: RoleOptions): UseBrowserImplReturnValue => {
  const [value, setValue] = useState<BrowserValue>({ value: '' });
  return {
    id: ROLE_BROWSER,
    name: 'Role',
    content: <RoleBrowser value={value.value} onChange={setValue} onDoubleClick={onDoubleClick} showtaskRoles={options?.showTaskRoles} />,
    accept: () => value,
    icon: IvyIcons.Users
  };
};

const RoleBrowser = (props: {
  value: string;
  showtaskRoles?: boolean;
  onChange: (value: BrowserValue) => void;
  onDoubleClick: () => void;
}) => {
  const { rolesAsTree: roleItems } = useRoles(props.showtaskRoles);

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
    if (Object.keys(rowSelection).length !== 1) {
      props.onChange({ value: '' });
      setShowHelper(false);
      return;
    }

    const selectedRow = table.getRowModel().rowsById[Object.keys(rowSelection)[0]];
    setShowHelper(true);
    props.onChange({ value: selectedRow.original.id });
  }, [props, rowSelection, table]);

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
        <AddRolePopover value={props.value} table={table} setAddedRoleName={setAddedRoleName} />
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
        </pre>
      )}
    </>
  );
};
