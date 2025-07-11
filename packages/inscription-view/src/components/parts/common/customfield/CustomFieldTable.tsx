import type { WfCustomField, WorkflowType } from '@axonivy/process-editor-inscription-protocol';
import { CUSTOM_FIELD_TYPE } from '@axonivy/process-editor-inscription-protocol';
import { ComboCell, SelectCell, SortableHeader, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../../context/useAction';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import type { SelectItem } from '../../../widgets/select/Select';
import { ScriptCell } from '../../../widgets/table/cell/ScriptCell';
import { PathCollapsible } from '../path/PathCollapsible';
import { ValidationRow } from '../path/validation/ValidationRow';
import { useResizableEditableTable } from '../table/useResizableEditableTable';

type CustomFieldTableProps = {
  data: WfCustomField[];
  onChange: (change: WfCustomField[]) => void;
  type: WorkflowType;
};

const EMPTY_WFCUSTOMFIELD: WfCustomField = { name: '', type: 'STRING', value: '' } as const;

const CustomFieldTable = ({ data, onChange, type }: CustomFieldTableProps) => {
  const { t } = useTranslation();
  const items = useMemo<SelectItem[]>(() => Object.entries(CUSTOM_FIELD_TYPE).map(([value, label]) => ({ label, value })), []);

  const { context } = useEditorContext();

  const predefinedCustomField: WfCustomField[] = useMeta('meta/workflow/customFields', { context, type: type }, []).data;

  const columns = useMemo<ColumnDef<WfCustomField, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => (
          <ComboCell
            options={predefinedCustomField.filter(pcf => !data.find(d => d.name === pcf.name)).map(pcf => ({ value: pcf.name }))}
            cell={cell}
          />
        )
      },
      {
        accessorKey: 'type',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.type')} />,
        cell: cell => <SelectCell cell={cell} items={items} />
      },
      {
        accessorKey: 'value',
        header: ({ column }) => <SortableHeader column={column} name={t('label.expression')} />,
        cell: cell => <ScriptCell cell={cell} type={CUSTOM_FIELD_TYPE[cell.row.original.type]} browsers={['attr', 'func', 'type', 'cms']} />
      }
    ],
    [data, items, predefinedCustomField, t]
  );

  const updateCustomFields = (data: Array<WfCustomField>, rowIndex: number, columnId: string) => {
    if (columnId !== 'name') {
      return data;
    }
    return data.map((customField, index) => {
      if (index === rowIndex) {
        const predefinedField = predefinedCustomField.find(pcf => pcf.name === customField.name);
        if (predefinedField && predefinedField.type !== customField.type) {
          return { ...customField, type: predefinedField.type };
        }
        return customField;
      }
      return customField;
    });
  };

  const { table, rowSelection, setRowSelection, removeRowAction, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: EMPTY_WFCUSTOMFIELD,
    specialUpdateData: updateCustomFields
  });

  const action = useAction('openCustomField');

  const tableActions =
    table.getSelectedRowModel().rows.length > 0
      ? [
          {
            label: t('label.openCustomField'),
            icon: IvyIcons.GoToSource,
            action: () => action({ name: table.getRowModel().rowsById[Object.keys(rowSelection)[0]].original.name, type })
          },
          removeRowAction
        ]
      : [];
  return (
    <PathCollapsible path='customFields' label={t('label.customFields')} defaultOpen={data.length > 0} controls={tableActions}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow row={row} key={row.id} rowPathSuffix={row.original.name}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
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

export default memo(CustomFieldTable);
