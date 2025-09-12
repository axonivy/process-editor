import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { InputCell, SortableHeader, Table, TableAddRow, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef, RowSelectionState, SortingState } from '@tanstack/react-table';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../../../context/usePath';
import { deepEqual } from '../../../../../utils/equals';
import Fieldset from '../../../../widgets/fieldset/Fieldset';
import type { FieldsetControl } from '../../../../widgets/fieldset/fieldset-control';
import { ScriptCell } from '../../../../widgets/table/cell/ScriptCell';
import { ValidationRow } from '../../../common/path/validation/ValidationRow';
import { focusNewCell } from '../../../common/table/cellFocus-utils';
import { useRestRequestData } from '../../useRestRequestData';
import { useRestResourceMeta } from '../../useRestResourceMeta';
import type { RestParam } from './rest-parameter';
import { restParamBuilder, toRestMap, updateRestParams } from './rest-parameter';

const EMPTY_PARAMETER: RestParam = { name: '', expression: '', known: false };

export const RestForm = () => {
  const { t } = useTranslation();
  const { config, updateBody } = useRestRequestData();

  const [data, setData] = useState<RestParam[]>([]);
  const restResource = useRestResourceMeta();

  useEffect(() => {
    const restResourceParam = restResource.method?.inBody.type;
    const params = restParamBuilder().openApiParam(restResourceParam).restMap(config.body.form).build();
    setData(params);
  }, [restResource.method?.inBody.type, config.body.form]);

  const onChange = (params: RestParam[]) => updateBody('form', toRestMap(params));

  const columns = useMemo<ColumnDef<RestParam, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => <InputCell cell={cell} disabled={cell.row.original.known} />
      },
      {
        accessorKey: 'expression',
        header: ({ column }) => <SortableHeader column={column} name={t('label.expression')} />,
        cell: cell => (
          <ScriptCell
            placeholder={cell.row.original.type}
            cell={cell}
            type={cell.row.original.type ?? IVY_SCRIPT_TYPES.OBJECT}
            browsers={['attr', 'func', 'type', 'cms']}
          />
        )
      }
    ],
    [t]
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const showAddButton = () => {
    return data.filter(obj => deepEqual(obj, EMPTY_PARAMETER)).length === 0;
  };

  const addRow = () => {
    const activeElement = document.activeElement;
    const domTable = activeElement?.parentElement?.previousElementSibling?.getElementsByTagName('table')[0];
    const newData = [...data];
    newData.push(EMPTY_PARAMETER);
    onChange(newData);
    setRowSelection({ [`${newData.length - 1}`]: true });
    focusNewCell(domTable, newData.length, 'input');
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
        onChange(updateRestParams(data, rowIndex, columnId, value));
      }
    }
  });

  const firstSelectionId = Object.keys(rowSelection)[0];
  let tableActions: FieldsetControl[] = [];
  if (firstSelectionId) {
    const firstSelectionRow = table.getRowModel().rowsById[firstSelectionId];
    if (firstSelectionRow && !firstSelectionRow?.original.known) {
      tableActions = [
        {
          label: t('label.removeRow'),
          icon: IvyIcons.Trash,
          action: () => removeRow(firstSelectionRow.index)
        }
      ];
    }
  }

  return (
    <PathContext path='form'>
      <div>
        {tableActions.length > 0 && <Fieldset label=' ' controls={tableActions} />}
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <ValidationRow row={row} key={row.id} rowPathSuffix={row.original.name} title={row.original.doc}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </ValidationRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton() && <TableAddRow addRow={addRow} />}
      </div>
    </PathContext>
  );
};
