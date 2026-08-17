import type { RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import { dataTreeHelper, Flex, TableBody, TableCell, TableRow, useTableKeyHandler } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRoles } from '../../parts/common/role/useRoles';
import { ExpandableCell } from '../../widgets/table/cell/ExpandableCell';
import { SearchTable } from '../../widgets/table/table/Table';
import BrowserTableRow from '../BrowserTableRow';
import type { BrowserValue, UseBrowserImplReturnValue } from '../useBrowser';
import { AddRolePopover } from './AddRolePopover';
export const ROLE_BROWSER = 'role' as const;

export type RoleOptions = {
  showTaskRoles?: boolean;
};

export const useRoleBrowser = (onDoubleClick: () => void, options?: RoleOptions): UseBrowserImplReturnValue => {
  const { t } = useTranslation();
  const [value, setValue] = useState<BrowserValue>({ value: '' });
  return {
    id: ROLE_BROWSER,
    name: t('browser.role.title'),
    content: <RoleBrowser value={value.value} onChange={setValue} onDoubleClick={onDoubleClick} showtaskRoles={options?.showTaskRoles} />,
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

const { columnHelper, tableOptions } = dataTreeHelper<RoleMeta>();

const RoleBrowser = ({ value, showtaskRoles, onChange, onDoubleClick }: RoleBrowserProps) => {
  const { t } = useTranslation();
  const { rolesAsTree: roleItems } = useRoles(showtaskRoles);

  const [showHelper, setShowHelper] = useState(false);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('id', {
          id: 'name',
          cell: cell => {
            return (
              <ExpandableCell cell={cell} title={cell.row.original.id} icon={IvyIcons.User} additionalInfo={cell.row.original.label} />
            );
          }
        })
      ]),
    []
  );

  const table = useTable({
    ...tableOptions,
    data: roleItems,
    columns: columns,
    initialState: {
      expanded: { [0]: true, [1]: true, [2]: true, [3]: true }
    },
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false
  });
  const { handleKeyDown } = useTableKeyHandler({ table, data: roleItems });

  useEffect(() => {
    const subscription = table.atoms.rowSelection.subscribe(() => {
      const selectedRow = table.getSelectedRowModel().flatRows[0];
      if (selectedRow === undefined) {
        onChange({ value: '' });

        setShowHelper(false);
        return;
      }

      setShowHelper(true);
      onChange({ value: selectedRow.original.id });
    });
    return () => subscription.unsubscribe();
  }, [onChange, table]);

  const [addedRole, setAddedRole] = useState('');

  useEffect(() => {
    if (addedRole.length === 0) {
      return;
    }
    const newRow = table.getRowModel().flatRows.find(row => row.original.id === addedRole);
    if (newRow) {
      newRow.getParentRow()?.toggleExpanded(true);

      table.setRowSelection({ [newRow.id]: true });
      // eslint-disable-next-line @eslint-react/set-state-in-effect
      setAddedRole('');
    }
  }, [addedRole, roleItems, table]);

  return (
    <>
      <Flex justifyContent='flex-end'>
        <AddRolePopover value={value} table={table} setAddedRoleName={setAddedRole} />
      </Flex>
      <SearchTable
        table={table}
        onSearchChange={filter => {
          table.setExpanded(filter.length > 0 ? true : { [0]: true });
          table.setRowSelection({});
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
