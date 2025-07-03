import { usePartState, type PartProps } from '../../editors/part/usePart';
import { useMailData } from './useMailData';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import type { ColumnDef } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useResizableEditableTable } from '../common/table/useResizableEditableTable';
import { Table, TableBody, TableCell } from '@axonivy/ui-components';
import { useValidations } from '../../../context/useValidation';
import { PathContext } from '../../../context/usePath';
import { ScriptCell } from '../../widgets/table/cell/ScriptCell';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { ValidationRow } from '../common/path/validation/ValidationRow';
import { useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

export function useMailAttachmentPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useMailData();
  const compareData = (data: MailData) => [data.attachments];
  const validations = useValidations(['attachments']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Attachments',
    name: t('part.mail.attachments.title'),
    state,
    content: <MailAttachmentsPart />,
    icon: IvyIcons.Attachment
  };
}

const MailAttachmentsPart = () => {
  return (
    <PathContext path='attachments'>
      <MailAttachmentTable />
    </PathContext>
  );
};

type MailAttachment = { attachment: string };
const EMPTY_ATTACHMENT: MailAttachment = { attachment: '' } as const;

const MailAttachmentTable = () => {
  const { t } = useTranslation();
  const { config, update } = useMailData();
  const data = useMemo<MailAttachment[]>(() => config.attachments.map(filename => ({ attachment: filename })), [config.attachments]);

  const columns = useMemo<ColumnDef<MailAttachment, string>[]>(
    () => [
      {
        id: 'attachment',
        accessorFn: row => row.attachment,
        cell: cell => (
          <ScriptCell cell={cell} type='Attachment' browsers={['attr', 'func', 'type', 'cms']} placeholder={'Enter the Attachment'} />
        )
      }
    ],
    []
  );

  const onChange = (change: MailAttachment[]) => {
    const mappedData = change.map<string>(attachment => attachment.attachment);
    update('attachments', mappedData);
  };

  const { table, removeRowAction, showAddButton } = useResizableEditableTable({
    data,
    columns,
    onChange,
    emptyDataObject: EMPTY_ATTACHMENT
  });

  const tableActions = table.getSelectedRowModel().rows.length > 0 ? [removeRowAction] : [];

  return (
    <ValidationCollapsible label={t('part.mail.attachments.title')} controls={tableActions} defaultOpen={true}>
      <div>
        {table.getRowModel().rows.length > 0 && (
          <Table>
            <TableBody>
              {table.getRowModel().rows.map(row => (
                <ValidationRow row={row} key={row.id} rowPathSuffix={row.index}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </ValidationRow>
              ))}
            </TableBody>
          </Table>
        )}
        {showAddButton()}
      </div>
    </ValidationCollapsible>
  );
};
