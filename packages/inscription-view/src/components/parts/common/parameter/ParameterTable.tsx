import type { ScriptVariable } from '@axonivy/process-editor-inscription-protocol';
import { dataTableHelper, InputCell, SortableHeader, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { flexRender } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserInputCell } from '../../../widgets/table/cell/BrowserInputCell';
import { PathCollapsible } from '../path/PathCollapsible';
import { ValidationRow } from '../path/validation/ValidationRow';
import { useResizableEditableTable } from '../table/useResizableEditableTable';

type ParameterTableProps = {
  data: ScriptVariable[];
  onChange: (change: ScriptVariable[]) => void;
  label: string;
  hideDesc?: boolean;
};

const EMPTY_SCRIPT_VARIABLE: ScriptVariable = { name: '', type: 'String', desc: '' } as const;

const { columnHelper } = dataTableHelper<ScriptVariable>();

const ParameterTable = ({ data, onChange, hideDesc, label }: ParameterTableProps) => {
  const { t } = useTranslation();
  const columns = useMemo(() => {
    const colDef = columnHelper.columns([
      columnHelper.accessor('name', {
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => <InputCell cell={cell} placeholder={t('label.enterName')} />
      }),
      columnHelper.accessor('type', {
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.type')} />,
        cell: cell => <BrowserInputCell cell={cell} />
      })
    ]);
    if (hideDesc === undefined || !hideDesc) {
      colDef.push(
        columnHelper.accessor('desc', {
          header: ({ column }) => <SortableHeader column={column} name={t('common.label.description')} />,
          cell: cell => <InputCell cell={cell} placeholder={t('label.enterDesc')} />
        })
      );
    }
    return colDef;
  }, [hideDesc, t]);

  const { table, selectedRowActions, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: EMPTY_SCRIPT_VARIABLE
  });

  return (
    <PathCollapsible path='params' label={label} controls={selectedRowActions()}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.setRowSelection({})} />
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
