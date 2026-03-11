import { type HistoryNode } from '@axonivy/process-editor-protocol';
import { ExpandableCell, Table, TableBody, TableCell, TableRow, useTableExpand, useTableGlobalFilter } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type ExpandedState } from '@tanstack/react-table';
import React, { useMemo } from 'react';

export type HistoryTreeProps = {
  data: Array<HistoryNode>;
  searchActive: boolean;
};

export const HistoryTree = ({ data, searchActive }: HistoryTreeProps) => {
  const globalFilter = useTableGlobalFilter({ searchAutoFocus: true });
  const expanded = useTableExpand<HistoryNode>(lastLeafPathExpandedState(data));
  const columns: ColumnDef<HistoryNode, string>[] = useMemo(
    () => [
      {
        accessorKey: 'description',
        cell: cell => (
          <ExpandableCell cell={cell} icon={historyNodeIcon(cell.row.original)}>
            <span>{cell.getValue()}</span>
          </ExpandableCell>
        )
      }
    ],
    []
  );
  const table = useReactTable({
    ...expanded.options,
    ...globalFilter.options,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...expanded.tableState,
      ...globalFilter.tableState
    }
  });

  return (
    <>
      {searchActive && globalFilter.filter}
      <Table>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const lastLeafPathExpandedState = (nodes: Array<HistoryNode>) => {
  const state: ExpandedState = {};
  let current = nodes;
  let rowId = '';

  while (current.length > 0) {
    const lastIndex = current.length - 1;
    rowId = rowId ? `${rowId}.${lastIndex}` : `${lastIndex}`;
    state[rowId] = true;

    const children = (current[lastIndex] as { children?: Array<HistoryNode> }).children ?? [];
    current = children;
  }

  return state;
};

const historyNodeIcon = (node: HistoryNode) => {
  switch (node.type) {
    case 'REQUEST_FINISHED':
      return IvyIcons.ActivitiesGroup;
    case 'REQUEST_PAUSED':
      return IvyIcons.Manual;
    case 'REQUEST_RUNNING':
      return IvyIcons.Play;
    case 'EXECUTION':
      return IvyIcons.Clock;
    case 'DATA':
      return IvyIcons.Attribute;
  }
};
