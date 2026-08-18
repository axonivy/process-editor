import { QUERY_ORDER } from '@axonivy/process-editor-inscription-protocol';
import {
  arraymove,
  dataTableHelper,
  indexOf,
  ReorderHandleWrapper,
  ReorderRow,
  SelectCell,
  Table,
  TableAddRow,
  TableBody,
  TableCell,
  TableResizableHeader
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender, useTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';
import type { SelectItem } from '../../../widgets/select/Select';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import { focusNewCell } from '../../common/table/cellFocus-utils';
import { useQueryData } from '../useQueryData';

type OrderDirection = keyof typeof QUERY_ORDER;

type Column = {
  name: string;
  sorting: OrderDirection;
};

const EMPTY_COLUMN: Column = { name: '', sorting: 'ASCENDING' };

const orderByToColumns = (orderBy: Array<string>) => {
  return orderBy.map<Column>(order => {
    const [name, ...parts] = order.split(' ');
    let sorting: OrderDirection = 'ASCENDING';
    if (parts.length > 0 && parts[0] === 'DESC') {
      sorting = 'DESCENDING';
    }
    return { name: name ?? '', sorting };
  });
};

const columnsToOrderBy = (data: Column[]) => {
  const orderBy = data.map(d => {
    let sorting = '';
    if (d.sorting === 'DESCENDING') {
      sorting = ' DESC';
    }
    return `${d.name}${sorting}`;
  });
  return orderBy;
};

const { columnHelper, tableOptions } = dataTableHelper<Column>();

export const TableSort = () => {
  const { t } = useTranslation();
  const { config, updateSql } = useQueryData();
  const [data, setData] = useState<Column[]>(() => orderByToColumns(config.query.sql.orderBy ?? []));

  const { elementContext: context } = useEditorContext();
  const columnItems = useMeta('meta/database/columns', { context, database: config.query.dbName, table: config.query.sql.table }, []).data;
  const orderItems = useMemo<SelectItem[]>(() => Object.entries(QUERY_ORDER).map(([label, value]) => ({ label, value })), []);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('name', {
          header: () => <span>{t('label.column')}</span>,
          cell: cell => <SelectCell cell={cell} items={columnItems.map(c => ({ label: c.name, value: c.name }))} />
        }),
        columnHelper.accessor('sorting', {
          header: () => <span>{t('part.db.direction')}</span>,
          cell: cell => (
            <ReorderHandleWrapper>
              <SelectCell cell={cell} items={orderItems} />
            </ReorderHandleWrapper>
          )
        })
      ]),
    [columnItems, orderItems, t]
  );

  const updateOrderBy = (data: Column[]) => {
    setData(data);
    updateSql('orderBy', columnsToOrderBy(data));
  };

  const table = useTable({
    ...tableOptions,
    data,
    columns,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    meta: {
      updateData: (rowId: string, columnId: string, value: unknown) => {
        if (typeof value !== 'string') {
          return;
        }
        const rowIndex = parseInt(rowId);
        const newData = data.map((row, index) => {
          if (index === rowIndex && data[rowIndex]) {
            return {
              ...data[rowIndex],
              [columnId]: value
            };
          }
          return row;
        });
        updateOrderBy(newData);
      }
    }
  });

  const removeRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    if (newData.length === 0) {
      table.setRowSelection({});
    } else if (index === data.length - 1) {
      table.setRowSelection({ [`${newData.length - 1}`]: true });
    }
    updateOrderBy(newData);
  };

  const addRow = () => {
    const activeElement = document.activeElement;
    const domTable = activeElement?.parentElement?.previousElementSibling?.getElementsByTagName('table')[0];
    const newData = [...data];
    newData.push(EMPTY_COLUMN);
    setData(newData);
    table.setRowSelection({ [`${newData.length - 1}`]: true });
    focusNewCell(domTable, newData.length, 'button');
  };

  const updateOrder = (moveId: string, targetId: string) => {
    const fromIndex = indexOf(data, obj => obj.name === moveId);
    const toIndex = indexOf(data, obj => obj.name === targetId);
    arraymove(data, fromIndex, toIndex);
    updateOrderBy(data);
  };

  const firstSelectedRow = table.getSelectedRowModel().rows[0];
  let tableActions: FieldsetControl[] = [];
  if (firstSelectedRow) {
    tableActions = [
      {
        label: t('label.removeRow'),
        icon: IvyIcons.Trash,
        action: () => removeRow(firstSelectedRow?.index)
      }
    ];
  }

  return (
    <PathCollapsible label={t('part.db.sort')} path='orderBy' defaultOpen={config.query.sql.orderBy?.length > 0} controls={tableActions}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ReorderRow row={row} key={row.id} id={row.original.name} updateOrder={updateOrder}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </ReorderRow>
            ))}
          </TableBody>
        </Table>
        {columnItems.length !== table.getRowModel().rows.length && <TableAddRow addRow={addRow} />}
      </div>
    </PathCollapsible>
  );
};
