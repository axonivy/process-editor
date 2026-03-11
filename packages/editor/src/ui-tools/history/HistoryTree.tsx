import { type HistoryNode } from '@axonivy/process-editor-protocol';
import { BasicTooltip, ExpandableCell, IvyIcon, Table, TableBody, TableCell, TableRow, useTableGlobalFilter } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnDef,
  type ExpandedState,
  type OnChangeFn
} from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isExpandableDataNode, isHistoryNodeLoaded, type HistoryLazyState } from './history-tree-state';

export type HistoryTreeProps = {
  data: Array<HistoryNode>;
  searchActive: boolean;
  expanded: ExpandedState;
  onExpandedChange: OnChangeFn<ExpandedState>;
  lazyState: HistoryLazyState;
  onLoadLazyNode: (node: HistoryNode) => void;
};

export const HistoryTree = ({ data, searchActive, expanded, onExpandedChange, lazyState, onLoadLazyNode }: HistoryTreeProps) => {
  const globalFilter = useTableGlobalFilter({ searchAutoFocus: true });
  const columns: ColumnDef<HistoryNode, string>[] = useMemo(
    () => [
      {
        accessorKey: 'description',
        cell: cell => {
          const node = cell.row.original;
          const label =
            node.type === 'EXECUTION'
              ? new Date(cell.getValue()).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  fractionalSecondDigits: 3
                })
              : cell.getValue();

          return (
            <ExpandableCell
              cell={cell}
              icon={historyNodeIcon(node)}
              lazy={
                isExpandableDataNode(node)
                  ? {
                      isLoaded: isHistoryNodeLoaded(node, lazyState),
                      loadChildren: () => onLoadLazyNode(node)
                    }
                  : undefined
              }
            >
              <LazyStatus lazyState={lazyState} node={node} />
              <span>{label}</span>
            </ExpandableCell>
          );
        }
      }
    ],
    [lazyState, onLoadLazyNode]
  );
  const table = useReactTable({
    ...globalFilter.options,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: row => row.children,
    getRowId: row => row.id,
    getRowCanExpand: row => row.original.children.length > 0,
    onExpandedChange,
    state: {
      expanded,
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

const LazyStatus = ({ lazyState, node }: { lazyState: HistoryLazyState; node: HistoryNode }) => {
  const { t } = useTranslation();
  if (lazyState.loadingById[node.id]) {
    return (
      <BasicTooltip content={t('history.loadingNode')}>
        <IvyIcon icon={IvyIcons.Spinner} spin className='lazy-state-icon' role='status' aria-label={t('history.loadingNode')} />
      </BasicTooltip>
    );
  }
  const error = lazyState.errorById[node.id];
  if (error) {
    return (
      <BasicTooltip content={error}>
        <IvyIcon icon={IvyIcons.ErrorXMark} className='lazy-state-icon' role='status' aria-label={error} />
      </BasicTooltip>
    );
  }
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
