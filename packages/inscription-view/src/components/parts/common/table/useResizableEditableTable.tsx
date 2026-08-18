import { dataTableHelper, TableAddRow, type DataTableFeatures } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Row, RowData } from '@tanstack/react-table';
import { useTable } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deepEqual } from '../../../../utils/equals';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';
import { focusNewCell } from './cellFocus-utils';

type DataTableColumns<TData extends RowData> = Parameters<ReturnType<typeof dataTableHelper<TData>>['columnHelper']['columns']>[0];

interface UseResizableEditableTableProps<TData extends RowData> {
  data: TData[];
  columns: DataTableColumns<TData>;
  onChange: (change: TData[]) => void;
  emptyDataObject: TData;
  specialUpdateData?: (data: Array<TData>, rowIndex: number, columnId: string) => void;
}

const useResizableEditableTable = <TData extends RowData>({
  data,
  columns,
  onChange,
  emptyDataObject,
  specialUpdateData
}: UseResizableEditableTableProps<TData>) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<TData[]>(data);

  const updateTableData = (tableData: Array<TData>) => {
    setTableData(tableData);
    onChange(tableData.filter(obj => !deepEqual(obj, emptyDataObject)));
  };

  const updateData = (rowId: string, columnId: string, value: unknown) => {
    if (typeof value !== 'string') {
      return;
    }
    const rowIndex = parseInt(rowId);
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex && tableData[rowIndex]) {
        return {
          ...tableData[rowIndex],
          [columnId]: value
        };
      }
      return row;
    });
    specialUpdateData?.(updatedData, rowIndex, columnId);
    if (!deepEqual(updatedData.at(-1), emptyDataObject) && rowIndex === tableData.length - 1) {
      updateTableData([...updatedData, emptyDataObject]);
    } else {
      updateTableData(updatedData);
    }
  };

  const { tableOptions } = dataTableHelper<TData>();

  const table = useTable({
    ...tableOptions,
    data: tableData,
    columns,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    meta: { updateData }
  });

  const addRow = () => {
    const activeElement = document.activeElement;
    const domTable = activeElement?.parentElement?.previousElementSibling?.getElementsByTagName('table')[0];
    const newData = [...tableData];
    newData.push(emptyDataObject);
    updateTableData(newData);
    table.setRowSelection({ [`${newData.length - 1}`]: true });
    focusNewCell(domTable, newData.length, 'input');
  };

  const showAddButton = () => {
    if (tableData.filter(obj => deepEqual(obj, emptyDataObject)).length === 0) {
      return <TableAddRow addRow={addRow} />;
    }
    return null;
  };

  const removeRow = (index: number) => {
    const newData = [...tableData];
    newData.splice(index, 1);
    if (newData.length === 0) {
      table.setRowSelection({});
    } else if (index === tableData.length - 1) {
      table.setRowSelection({ [`${newData.length - 1}`]: true });
    }
    if (newData.length === 1 && deepEqual(newData[0], emptyDataObject)) {
      updateTableData([]);
    } else {
      updateTableData(newData);
    }
  };

  const selectedRowActions = (additionalActionsSupplier?: (row: Row<DataTableFeatures, TData>, rowIndex: number) => FieldsetControl[]) => {
    if (table.getSelectedRowModel().rows.length === 0) {
      return [];
    }
    const firstSelectedRow = table.getSelectedRowModel().rows[0];
    if (firstSelectedRow === undefined) {
      return [];
    }
    const firstSelectedRowIndex = table.getRowModel().rowsById[firstSelectedRow.id]?.index;
    if (firstSelectedRowIndex === undefined) {
      return [];
    }
    const additionalActions = additionalActionsSupplier?.(firstSelectedRow, firstSelectedRowIndex) ?? [];
    return [{ label: t('label.removeRow'), icon: IvyIcons.Trash, action: () => removeRow(firstSelectedRowIndex) }, ...additionalActions];
  };

  return { table, selectedRowActions, showAddButton };
};

export { useResizableEditableTable };
