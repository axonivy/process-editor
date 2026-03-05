import { RequestHistoryAction, type HistoryNode } from '@axonivy/process-editor-protocol';
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
import { type IActionDispatcher } from '@eclipse-glsp/client/lib/re-exports';
import { useQuery } from '@tanstack/react-query';
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const History = ({ actionDispatcher, elementId }: { actionDispatcher: IActionDispatcher; elementId: string }) => {
  const { t } = useTranslation();
  const query = useQuery({
    queryKey: ['process-history', elementId],
    queryFn: () => actionDispatcher.request(RequestHistoryAction.create({ elementId }))
  });
  const [searchActive, setSearchActive] = useState(false);
  const globalFilter = useTableGlobalFilter({ searchAutoFocus: true });
  const expanded = useTableExpand<HistoryNode>();
  const columns: ColumnDef<HistoryNode, string>[] = [
    {
      accessorKey: 'description',
      cell: cell => (
        <ExpandableCell cell={cell} icon={historyNodeIcon(cell.row.original)}>
          <span>{cell.getValue()}</span>
        </ExpandableCell>
      )
    }
  ];
  const table = useReactTable({
    ...expanded.options,
    ...globalFilter.options,
    data: query.data?.historyNodes || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      ...expanded.tableState,
      ...globalFilter.tableState
    }
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

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
