import type { RoleMeta } from '@axonivy/process-editor-inscription-protocol';
import type { Table } from '@tanstack/react-table'; // replace with the actual path
import { describe, expect, test } from 'vitest';
import { isValidRowSelected, newNameExists, newNameIsValid } from './validate-role';

const testTable = (rows: RoleMeta[], selectedRow?: RoleMeta): Table<RoleMeta> => {
  return {
    getRowModel: () => ({
      flatRows: rows.map(row => ({ original: row }))
    }),
    getSelectedRowModel: () => ({
      flatRows: selectedRow ? [{ original: selectedRow }] : []
    })
  } as Table<RoleMeta>;
};

describe('newNameExists', () => {
  test('return true if the new role name exists in the table', () => {
    const table = testTable([{ id: 'role1', children: [], label: 'Role 1' }]);
    expect(newNameExists(table, 'role1')).toBe(true);
  });

  test('return false if the new role name does not exist in the table', () => {
    const table = testTable([{ id: 'role2', children: [], label: 'Role 2' }]);
    expect(newNameExists(table, 'role1')).toBe(false);
  });
});

describe('newNameIsValid', () => {
  test('return false if the new role name is empty', () => {
    const table = testTable([{ id: 'role1', children: [], label: 'Role 1' }]);
    expect(newNameIsValid(table, '')).toBe(false);
  });

  test('return false if the new role name already exists', () => {
    const table = testTable([{ id: 'role1', children: [], label: 'Role 1' }]);
    expect(newNameIsValid(table, 'role1')).toBe(false);
  });

  test('return false if the new role name only has whitespaces', () => {
    const table = testTable([]);
    expect(newNameIsValid(table, '   ')).toBe(false);
  });

  test('return true if the new role name is unique and non-empty', () => {
    const table = testTable([{ id: 'role1', children: [], label: 'Role 1' }]);
    expect(newNameIsValid(table, 'role2')).toBe(true);
  });
});

describe('isValidRowSelected', () => {
  test('return false if no row is selected', () => {
    const table = testTable([{ id: 'role1', children: [], label: 'Role 1' }]);
    expect(isValidRowSelected(table, [])).toBe(false);
  });

  test('return false if the selected row is in the task roles list', () => {
    const selectedRole = { id: 'role1', children: [], label: 'Role 1' };
    const table = testTable([selectedRole], selectedRole);
    expect(isValidRowSelected(table, [selectedRole])).toBe(false);
  });

  test('return true if the selected row is not in the task roles list', () => {
    const selectedRole = { id: 'role1', children: [], label: 'Role 1' };
    const table = testTable([{ id: 'role2', children: [], label: 'Role 2' }], selectedRole);
    expect(isValidRowSelected(table, [{ id: 'role3', children: [], label: 'Role 3' }])).toBe(true);
  });
});
