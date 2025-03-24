import type { ScriptVariable } from '@axonivy/process-editor-inscription-protocol';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { ValidationRow } from '../path/validation/ValidationRow';
import { PathCollapsible } from '../path/PathCollapsible';
import { useResizableEditableTable } from '../table/useResizableEditableTable';
import { InputCell, SortableHeader, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { BrowserInputCell } from '../../../widgets/table/cell/BrowserInputCell';
import { useTranslation } from 'react-i18next';

type ParameterTableProps = {
  data: ScriptVariable[];
  onChange: (change: ScriptVariable[]) => void;
  label: string;
  hideDesc?: boolean;
};

const EMPTY_SCRIPT_VARIABLE: ScriptVariable = { name: '', type: 'String', desc: '' } as const;

const ParameterTable = ({ data, onChange, hideDesc, label }: ParameterTableProps) => {
  const { t } = useTranslation();
  const columns = useMemo(() => {
    const colDef: ColumnDef<ScriptVariable, string>[] = [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common:label.name')} />,
        cell: cell => <InputCell cell={cell} placeholder={t('label.enterName')} />
      },
      {
        accessorKey: 'type',
        header: ({ column }) => <SortableHeader column={column} name={t('common:label.type')} />,
        cell: cell => <BrowserInputCell cell={cell} />
      }
    ];
    if (hideDesc === undefined || !hideDesc) {
      colDef.push({
        accessorKey: 'desc',
        header: ({ column }) => <SortableHeader column={column} name={t('common:label.description')} />,
        cell: cell => <InputCell cell={cell} placeholder={t('label.enterDesc')} />
      });
    }
    return colDef;
  }, [hideDesc, t]);

  const { table, setRowSelection, removeRowAction, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: EMPTY_SCRIPT_VARIABLE
  });

  const tableActions = table.getSelectedRowModel().rows.length > 0 ? [removeRowAction] : [];

  return (
    <PathCollapsible path='params' label={label} controls={tableActions}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow key={row.id} row={row} rowPathSuffix={row.original.name}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </ValidationRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton()}
      </div>
    </PathCollapsible>
  );
};

export default memo(ParameterTable);
