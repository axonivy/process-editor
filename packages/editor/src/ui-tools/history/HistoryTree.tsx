// @jsxRuntime automatic
import { type HistoryNode } from '@axonivy/process-editor-protocol';
import { ExpandableCell, IvyIcon, Table, TableBody, TableCell, TableRow, useTableGlobalFilter } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isExpandableDataNode, isLazyPlaceholderNode, type LazyHistoryNode } from './history-tree-state';

export type HistoryTreeProps = {
  data: Array<LazyHistoryNode>;
  searchActive: boolean;
  onLoadLazyNode: (node: HistoryNode) => void;
};

export const HistoryTree = ({ data, searchActive, onLoadLazyNode }: HistoryTreeProps) => {
  const { t } = useTranslation();
  const globalFilter = useTableGlobalFilter({ searchAutoFocus: true });
  const columns: ColumnDef<LazyHistoryNode, string>[] = useMemo(
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
              lazy={isLazyParentNode(node) ? { isLoaded: false, loadChildren: () => onLoadLazyNode(node) } : undefined}
            >
              <HistoryNodeIcon node={node} />
              <span>{lazyPlaceholderLabel(node, label, t)}</span>
            </ExpandableCell>
          );
        }
      }
    ],
    [onLoadLazyNode, t]
  );
  const table = useReactTable({
    ...globalFilter.options,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: row => row.children,
    getRowId: row => row.id,
    getRowCanExpand: row => row.original.children.length > 0 && !isLazyParentNode(row.original),
    state: globalFilter.tableState
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

const HistoryNodeIcon = ({ node }: { node: LazyHistoryNode }) => {
  const { t } = useTranslation();
  if (isLazyPlaceholderNode(node) && node.lazyPlaceholderState === 'loading') {
    return <IvyIcon icon={IvyIcons.Spinner} spin className='lazy-state-icon' role='status' aria-label={t('history.loadingNode')} />;
  }
  if (isLazyPlaceholderNode(node) && node.lazyPlaceholderState === 'error') {
    return <IvyIcon icon={IvyIcons.ErrorXMark} className='lazy-state-icon' role='status' aria-label={t('history.lazyLoadError')} />;
  }
  return <IvyIcon icon={historyNodeIcon(node)} />;
};

const isLazyParentNode = (node: LazyHistoryNode) => isExpandableDataNode(node) && node.children.some(isLazyPlaceholderNode);

const lazyPlaceholderLabel = (node: LazyHistoryNode, label: string, t: ReturnType<typeof useTranslation>['t']) => {
  if (node.lazyPlaceholderState === 'idle' || node.lazyPlaceholderState === 'loading') {
    return t('history.loadingNode');
  }
  if (node.lazyPlaceholderState === 'error') {
    return t('history.lazyLoadError');
  }
  return label;
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
