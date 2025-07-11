import { TableAddRow } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deepEqual } from '../../../../utils/equals';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';
import { focusNewCell } from './cellFocus-utils';

interface UseResizableEditableTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, string>[];
  onChange: (change: TData[]) => void;
  emptyDataObject: TData;
  specialUpdateData?: (data: Array<TData>, rowIndex: number, columnId: string) => void;
}

const useResizableEditableTable = <TData,>({
  data,
  columns,
  onChange,
  emptyDataObject,
  specialUpdateData
}: UseResizableEditableTableProps<TData>) => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<TData[]>(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const updateTableData = (tableData: Array<TData>) => {
    setTableData(tableData);
    onChange(tableData.filter(obj => !deepEqual(obj, emptyDataObject)));
  };

  const updateData = (rowId: string, columnId: string, value: string) => {
    const rowIndex = parseInt(rowId);
    const updatedData = tableData.map((row, index) => {
      if (index === rowIndex) {
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

  const table = useReactTable({
    data: tableData,
    columns,
    state: { sorting, rowSelection },
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { updateData }
  });

  const addRow = () => {
    const activeElement = document.activeElement;
    const domTable = activeElement?.parentElement?.previousElementSibling?.getElementsByTagName('table')[0];
    const newData = [...tableData];
    newData.push(emptyDataObject);
    updateTableData(newData);
    setRowSelection({ [`${newData.length - 1}`]: true });
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
      setRowSelection({});
    } else if (index === tableData.length - 1) {
      setRowSelection({ [`${newData.length - 1}`]: true });
    }
    if (newData.length === 1 && deepEqual(newData[0], emptyDataObject)) {
      updateTableData([]);
    } else {
      updateTableData(newData);
    }
  };

  const removeRowAction: FieldsetControl = {
    label: t('label.removeRow'),
    icon: IvyIcons.Trash,
    action: () => removeRow(table.getRowModel().rowsById[Object.keys(rowSelection)[0]].index)
  };

  return { table, rowSelection, removeRowAction, setRowSelection, showAddButton };
};

export { useResizableEditableTable };
