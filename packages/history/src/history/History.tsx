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
import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type HistoryNode = {
  id: string;
  title: string;
  icon?: IvyIcons;
  children: Array<HistoryNode>;
};

export const History = ({ elementId }: { elementId: string }) => {
  const { t } = useTranslation();
  const [searchActive, setSearchActive] = useState(false);
  const globalFilter = useTableGlobalFilter({ searchAutoFocus: true });
  const expanded = useTableExpand<HistoryNode>();
  const columns: ColumnDef<HistoryNode, string>[] = [
    {
      accessorKey: 'title',
      cell: cell => (
        <ExpandableCell cell={cell} icon={cell.row.original.icon}>
          <span>{cell.getValue()}</span>
        </ExpandableCell>
      )
    }
  ];
  const table = useReactTable({
    ...expanded.options,
    ...globalFilter.options,
    data: tempData,
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
            <TableRow key={row.original.id}>
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

const tempData: HistoryNode[] = [
  {
    id: '1',
    title: 'HTTP GET Humantask/...',
    icon: IvyIcons.ArrowRight,
    children: [
      {
        id: '1-1',
        title: '11:34:44.368',
        icon: IvyIcons.Settings,
        children: [
          {
            id: '1-1-1',
            title: 'in = workflow.humantask.Pro...',
            icon: IvyIcons.Attachment,
            children: [
              {
                id: '1-1-1-1',
                title: 'accepted = null',
                icon: IvyIcons.Attachment,
                children: []
              },
              {
                id: '1-1-1-2',
                title: 'amount = null',
                icon: IvyIcons.Attachment,
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '1-2',
        title: 'Node 1.2',
        children: []
      }
    ]
  },
  {
    id: '2',
    title: 'Node 2',
    children: []
  }
];
