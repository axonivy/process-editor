import type { ScriptMappings } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { ComboCell, SortableHeader, Table, TableAddRow, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deepEqual } from '../../../../utils/equals';
import type { ComboboxItem } from '../../../widgets/combobox/Combobox';
import { ScriptCell } from '../../../widgets/table/cell/ScriptCell';
import { ValidationCollapsible } from '../path/validation/ValidationCollapsible';
import { ValidationRow } from '../path/validation/ValidationRow';
import { Property } from './properties';

type PropertyTableProps = {
  properties: ScriptMappings;
  update: (change: ScriptMappings) => void;
  knownProperties: string[];
  hideProperties?: string[];
  label: string;
  defaultOpen?: boolean;
};

const EMPTY_PROPERTY: Property = { expression: '', name: '' };

export const PropertyTable = ({ properties, update, knownProperties, hideProperties, label, defaultOpen }: PropertyTableProps) => {
  const { t } = useTranslation();
  const data = useMemo(() => Property.of(properties), [properties]);

  const onChange = (props: Property[]) => update(Property.to(props));

  const knownPropertyItems = knownProperties.map<ComboboxItem>(prop => ({ value: prop }));

  const columns = useMemo<ColumnDef<Property, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => <ComboCell cell={cell} options={knownPropertyItems} />
      },
      {
        accessorKey: 'expression',
        header: ({ column }) => <SortableHeader column={column} name={t('label.expression')} />,
        cell: cell => (
          <ScriptCell
            cell={cell}
            type={IVY_SCRIPT_TYPES.OBJECT}
            browsers={['attr', 'func', 'type', 'cms']}
            placeholder={t('label.enterExpression')}
          />
        )
      }
    ],
    [knownPropertyItems, t]
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const showAddButton = () => {
    return data.filter(obj => deepEqual(obj, EMPTY_PROPERTY)).length === 0;
  };

  const addRow = () => {
    const newData = [...data];
    newData.push(EMPTY_PROPERTY);
    onChange(newData);
    setRowSelection({ [`${newData.length - 1}`]: true });
  };

  const removeRow = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    if (newData.length === 0) {
      setRowSelection({});
    } else if (index === data.length - 1) {
      setRowSelection({ [`${newData.length - 1}`]: true });
    }
    onChange(newData);
  };

  const table = useReactTable({
    data,
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
    meta: {
      updateData: (rowId: string, columnId: string, value: string) => {
        const rowIndex = parseInt(rowId);
        onChange(Property.update(data, rowIndex, columnId, value));
      }
    }
  });

  const tableActions =
    table.getSelectedRowModel().rows.length > 0
      ? [
          {
            label: t('label.removeRow'),
            icon: IvyIcons.Trash,
            action: () => removeRow(table.getRowModel().rowsById[Object.keys(rowSelection)[0]].index)
          }
        ]
      : [];

  return (
    <ValidationCollapsible label={label} defaultOpen={defaultOpen} controls={tableActions}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => {
              if (hideProperties?.includes(row.original.name)) {
                return null;
              }
              return (
                <ValidationRow row={row} key={row.id} rowPathSuffix={row.original.name}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </ValidationRow>
              );
            })}
          </TableBody>
        </Table>
        {showAddButton() && <TableAddRow addRow={addRow} />}
      </div>
    </ValidationCollapsible>
  );
};
