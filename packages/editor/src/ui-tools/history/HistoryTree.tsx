// @jsxRuntime automatic
import { type HistoryNode } from '@axonivy/process-editor-protocol';
import {
  BasicTooltip,
  dataTreeHelper,
  ExpandableCell,
  IvyIcon,
  Table,
  TableBody,
  TableCell,
  TableGlobalFilter,
  TableRow,
  type DataTableFeatures
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, useTable, type ExpandedState, type OnChangeFn } from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { isExpandableDataNode, isHistoryNodeLoaded, lastLeafPathExpandedState, type HistoryLazyState } from './history-tree-state';

export type HistoryTreeProps = {
  data: Array<HistoryNode>;
  searchActive: boolean;
  expanded: ExpandedState;
  onExpandedChange: OnChangeFn<ExpandedState>;
  lazyState: HistoryLazyState;
  onLoadLazyNode: (node: HistoryNode) => void;
};

const { columnHelper, tableOptions } = dataTreeHelper<HistoryNode>();
const loadingChildIdPrefix = 'history-loading-';

export const HistoryTree = ({ data, searchActive, expanded, onExpandedChange, lazyState, onLoadLazyNode }: HistoryTreeProps) => {
  const treeData = useMemo(() => addLoadingChildren(data, lazyState.loadingById), [data, lazyState.loadingById]);
  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('description', {
          cell: cell => {
            const node = cell.row.original;
            const loadingParentId = getLoadingParentId(node.id);
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
                icon={loadingParentId ? undefined : historyNodeIcon(node)}
                lazy={
                  isExpandableDataNode(node)
                    ? {
                        isLoaded: isHistoryNodeLoaded(node, lazyState),
                        loadChildren: () => onLoadLazyNode(node)
                      }
                    : undefined
                }
              >
                {loadingParentId ? (
                  <LazyStatus lazyState={lazyState} nodeId={loadingParentId} />
                ) : (
                  <>
                    <LazyStatus lazyState={lazyState} nodeId={node.id} />
                    <span>{label}</span>
                  </>
                )}
              </ExpandableCell>
            );
          }
        })
      ]),
    [lazyState, onLoadLazyNode]
  );
  const table = useTable<DataTableFeatures, HistoryNode>({
    ...tableOptions,
    data: treeData,
    columns,
    getRowId: row => row.id,
    initialState: { expanded: lastLeafPathExpandedState(treeData) },
    autoResetExpanded: false,
    onExpandedChange,
    state: { expanded }
  });

  return (
    <>
      {searchActive && <TableGlobalFilter table={table} autoFocus={true} />}
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

const LazyStatus = ({ lazyState, nodeId }: { lazyState: HistoryLazyState; nodeId: string }) => {
  const { t } = useTranslation();
  if (lazyState.loadingById[nodeId]) {
    return (
      <BasicTooltip content={t('history.loadingNode')}>
        <IvyIcon icon={IvyIcons.Spinner} spin className='lazy-state-icon' role='status' aria-label={t('history.loadingNode')} />
      </BasicTooltip>
    );
  }
  const error = lazyState.errorById[nodeId];
  if (error) {
    return (
      <BasicTooltip content={error}>
        <IvyIcon icon={IvyIcons.ErrorXMark} className='lazy-state-icon' role='status' aria-label={error} />
      </BasicTooltip>
    );
  }
};

const addLoadingChildren = (nodes: Array<HistoryNode>, loadingById: Record<string, boolean>): Array<HistoryNode> =>
  nodes.map(node => {
    const children = addLoadingChildren(node.children, loadingById);
    if (!loadingById[node.id]) {
      return children === node.children ? node : { ...node, children };
    }

    return {
      ...node,
      children: [
        {
          id: `${loadingChildIdPrefix}${node.id}`,
          type: 'DATA',
          description: 'Loading...',
          expandable: false,
          children: []
        }
      ]
    };
  });

const getLoadingParentId = (nodeId: string) =>
  nodeId.startsWith(loadingChildIdPrefix) ? nodeId.slice(loadingChildIdPrefix.length) : undefined;

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
