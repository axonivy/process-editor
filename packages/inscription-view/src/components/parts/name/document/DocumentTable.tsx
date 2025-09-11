import type { Document } from '@axonivy/process-editor-inscription-protocol';
import { InputCell, SelectRow, SortableHeader, Table, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../../context/useAction';
import Collapsible from '../../../widgets/collapsible/Collapsible';
import { useResizableEditableTable } from '../../common/table/useResizableEditableTable';

const EMPTY_DOCUMENT: Document = { name: '', url: '' } as const;

const DocumentTable = ({ data, onChange }: { data: Document[]; onChange: (change: Document[]) => void }) => {
  const { t } = useTranslation();
  const columns = useMemo<ColumnDef<Document, string>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => <SortableHeader column={column} name={t('common.label.name')} />,
        cell: cell => <InputCell cell={cell} placeholder={t('label.enterName')} />
      },
      {
        accessorFn: row => row.url,
        id: 'url',
        header: ({ column }) => <SortableHeader column={column} name={t('label.URL')} />,
        cell: cell => <InputCell cell={cell} placeholder={t('label.enterUrl')} />
      }
    ],
    [t]
  );

  const { table, setRowSelection, selectedRowActions, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: EMPTY_DOCUMENT
  });

  const action = useAction('openPage');

  const tableActions = selectedRowActions(row => [
    {
      label: t('label.openUrl'),
      icon: IvyIcons.GoToSource,
      action: () => action(row.original.url)
    }
  ]);

  return (
    <Collapsible label={t('part.general.meansAndDocuments')} controls={tableActions} defaultOpen={data !== undefined && data.length > 0}>
      <div>
        <Table>
          <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => setRowSelection({})} />
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <SelectRow key={row.id} row={row}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </SelectRow>
            ))}
          </TableBody>
        </Table>
        {showAddButton()}
      </div>
    </Collapsible>
  );
};

export default memo(DocumentTable);
