import { type HistoryNode } from '@axonivy/process-editor-protocol';
import {
  BasicField,
  ButtonGroup,
  ExpandableCell,
  Table,
  TableBody,
  TableCell,
  TableRow,
  useTableExpand,
  useTableGlobalFilter
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef, type ExpandedState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const HistoryTree = ({ elementId, data }: { elementId: string; data: Array<HistoryNode> }) => {
  const { t } = useTranslation();
  const [searchActive, setSearchActive] = useState(false);
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
    <BasicField
      label={`History of '${elementId}'`}
      control={
        <ButtonGroup
          controls={[
            {
              title: t('common.label.search'),
              'aria-label': t('common.label.search'),
              icon: IvyIcons.Search,
              toggle: searchActive,
              onClick: () => setSearchActive(show => !show)
            },
            {
              title: t('common.label.refresh'),
              'aria-label': t('common.label.refresh'),
              icon: IvyIcons.Reset,
              onClick: () => console.log('refresh clicked')
            }
          ]}
        />
      }
    >
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
    </BasicField>
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
