import type { RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import type { DataTableFeatures } from '@axonivy/ui-components';
import type { Table } from '@tanstack/react-table';

export const newNameExists = (table: Table<DataTableFeatures, RoleMeta>, newRoleName: string): boolean => {
  return table.getRowModel().flatRows.some(row => row.original.id === newRoleName);
};

export const newNameIsValid = (table: Table<DataTableFeatures, RoleMeta>, newRoleName: string): boolean => {
  if (newRoleName.length === 0 || newRoleName.trim().length === 0) {
    return false;
  }
  if (newNameExists(table, newRoleName)) {
    return false;
  }
  return true;
};

export const isValidRowSelected = (table: Table<DataTableFeatures, RoleMeta>, taskRoles: RoleMeta[]): boolean => {
  const selectedRow = table.getSelectedRowModel().flatRows[0]?.original;
  if (!selectedRow) return false;

  return !taskRoles.some(role => role.id === selectedRow.id);
};
