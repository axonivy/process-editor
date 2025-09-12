import type { StartCustomStartField } from '@axonivy/process-editor-inscription-protocol';
import { ComboCell, SortableHeader, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../../context/useAction';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import type { ComboboxItem } from '../../../widgets/combobox/Combobox';
import { MacroCell } from '../../../widgets/table/cell/MacroCell';
import { PathCollapsible } from '../path/PathCollapsible';
import { ValidationRow } from '../path/validation/ValidationRow';
import { useResizableEditableTable } from '../table/useResizableEditableTable';

type StartCustomFieldTableProps = {
  data: StartCustomStartField[];
  onChange: (change: StartCustomStartField[]) => void;
};

const EMPTY_STARTCUSTOMSTARTFIELD: StartCustomStartField = { name: '', value: '' } as const;

const StartCustomFieldTable = ({ data, onChange }: StartCustomFieldTableProps) => {
  const { t } = useTranslation();
  const { context } = useEditorContext();
  const predefinedCustomField: ComboboxItem[] = useMeta(
    'meta/workflow/customFields',
    { context, type: 'START' },
    []
  ).data.map<ComboboxItem>(pcf => ({
    value: pcf.name
  }));

  const columns = useMemo<ColumnDef<StartCustomStartField, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => <ComboCell cell={cell} options={predefinedCustomField.filter(pcf => !data.find(d => d.name === pcf.value))} />
      },
      {
        accessorKey: 'value',
        header: ({ column }) => <SortableHeader column={column} name={t('label.expression')} />,
        cell: cell => <MacroCell cell={cell} placeholder={'Enter an Expression'} />
      }
    ],
    [data, predefinedCustomField, t]
  );

  const { table, setRowSelection, selectedRowActions, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: EMPTY_STARTCUSTOMSTARTFIELD
  });

  const action = useAction('openCustomField');

  const tableActions = selectedRowActions(row => [
    {
      label: t('label.openCustomField'),
      icon: IvyIcons.GoToSource,
      action: () => action({ name: row.original.name, type: 'START' })
    }
  ]);

  return (
    <PathCollapsible path='customFields' controls={tableActions} label={t('label.customFields')} defaultOpen={data.length > 0}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow row={row} key={row.id} rowPathSuffix={row.original.name}>
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

export default memo(StartCustomFieldTable);
