import type { PredefinedCustomField, StartCustomStartField } from '@axonivy/process-editor-inscription-protocol';
import { ComboCell, dataTableHelper, SortableHeader, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { flexRender } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../../context/useAction';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { MacroCell } from '../../../widgets/table/cell/MacroCell';
import { PathCollapsible } from '../path/PathCollapsible';
import { ValidationRow } from '../path/validation/ValidationRow';
import { useResizableEditableTable } from '../table/useResizableEditableTable';
import { resolveProject } from './custom-field-utils';

type StartCustomFieldTableProps = {
  data: StartCustomStartField[];
  onChange: (change: StartCustomStartField[]) => void;
};

const EMPTY_STARTCUSTOMSTARTFIELD: StartCustomStartField = { name: '', value: '' } as const;

const { columnHelper } = dataTableHelper<StartCustomStartField>();

const StartCustomFieldTable = ({ data, onChange }: StartCustomFieldTableProps) => {
  const { t } = useTranslation();
  const { context } = useEditorContext();
  const predefinedCustomField: Array<PredefinedCustomField> = useMeta('meta/workflow/customFields', { context, type: 'START' }, []).data;

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('name', {
          header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
          cell: cell => (
            <ComboCell
              cell={cell}
              options={predefinedCustomField.filter(pcf => !data.find(d => d.name === pcf.name)).map(pcf => ({ value: pcf.name }))}
            />
          )
        }),
        columnHelper.accessor('value', {
          header: ({ column }) => <SortableHeader column={column} name={t('label.expression')} />,
          cell: cell => <MacroCell cell={cell} placeholder={'Enter an Expression'} />
        })
      ]),
    [data, predefinedCustomField, t]
  );

  const { table, selectedRowActions, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: EMPTY_STARTCUSTOMSTARTFIELD
  });

  const openAction = useAction('openCustomField');
  const action = () => {
    const project = resolveProject(table, predefinedCustomField);
    openAction(project ? { project } : undefined);
  };
  const tableActions = selectedRowActions();
  tableActions.push({
    label: t('label.openCustomField'),
    icon: IvyIcons.GoToSource,
    action
  });

  return (
    <PathCollapsible path='customFields' controls={tableActions} label={t('label.customFields')} defaultOpen={data.length > 0}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.setRowSelection({})} />
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
