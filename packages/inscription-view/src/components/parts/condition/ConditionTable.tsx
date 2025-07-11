import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { ReorderHandleWrapper, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScriptCell } from '../../widgets/table/cell/ScriptCell';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { ValidationSelectableReorderRow } from '../common/path/validation/ValidationRow';
import { Condition } from './condition';

const ConditionTypeCell = ({ condition }: { condition: Condition }) => {
  if (condition.target) {
    return <span>{`${condition.target.name}: ${condition.target.type.id}`}</span>;
  }
  return <span>⛔ {condition.fid}</span>;
};

const ConditionTable = ({ data, onChange }: { data: Condition[]; onChange: (change: Condition[]) => void }) => {
  const { t } = useTranslation();
  const updateOrder = useCallback(
    (moveId: string, targetId: string) => {
      onChange(Condition.move(data, moveId, targetId));
    },
    [data, onChange]
  );
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

  const columns = useMemo<ColumnDef<Condition, string>[]>(
    () => [
      {
        accessorKey: 'fid',
        header: () => <span>{t('common.label.type')}</span>,
        cell: cell => <ConditionTypeCell condition={cell.row.original} />
      },
      {
        accessorKey: 'expression',
        header: () => <span>{t('label.expression')}</span>,
        cell: cell => (
          <ReorderHandleWrapper>
            <ScriptCell
              cell={cell}
              type={IVY_SCRIPT_TYPES.BOOLEAN}
              browsers={['condition', 'attr', 'func']}
              placeholder={t('label.enterExpression')}
            />
          </ReorderHandleWrapper>
        )
      }
    ],
    [t]
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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
        onChange(Condition.update(data, rowIndex, columnId, value));
      }
    }
  });

  const showDeleteAction =
    table.getSelectedRowModel().rows.length > 0 && !table.getRowModel().rowsById[Object.keys(rowSelection)[0]].original.target;

  const tableActions = showDeleteAction
    ? [
        {
          label: t('label.removeRow'),
          icon: IvyIcons.Trash,
          action: () => removeRow(table.getRowModel().rowsById[Object.keys(rowSelection)[0]].index)
        }
      ]
    : [];

  return (
    <ValidationCollapsible label={t('part.condition.title')} controls={tableActions} defaultOpen={true}>
      <Table>
        <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <ValidationSelectableReorderRow
              row={row}
              key={row.id}
              id={row.original.fid}
              updateOrder={updateOrder}
              rowPathSuffix={row.index}
            >
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </ValidationSelectableReorderRow>
          ))}
        </TableBody>
      </Table>
    </ValidationCollapsible>
  );
};

export default ConditionTable;
