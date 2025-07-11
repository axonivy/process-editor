import type { TableRow } from '@axonivy/ui-components';
import { MessageRow, ReorderRow, SelectRow } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';
import type { ComponentPropsWithoutRef } from 'react';
import { mergePaths, usePath } from '../../../../../context/usePath';
import { useValidations } from '../../../../../context/useValidation';
import { toMessageData, type ValidationMessage } from '../../../../widgets/message/Message';
import './ValidationRow.css';

type ValidationProps<TData> = {
  row: Row<TData>;
  rowPathSuffix: string | number;
};

type ValidationRowProps<TData> = ComponentPropsWithoutRef<typeof TableRow> & ValidationProps<TData>;

const styleMessageRow = (validation?: ValidationMessage) => {
  if (validation) {
    return `row-${validation.severity.toLocaleLowerCase()}`;
  }
  return '';
};

const useValidationRow = (rowPathSuffix: string | number) => {
  const validations = useValidations();
  const path = usePath();
  const rowPath = mergePaths(path, [rowPathSuffix]);
  return validations.find(val => val.path === rowPath);
};

export const ValidationRow = <TData extends object>({ rowPathSuffix, row, ...props }: ValidationRowProps<TData>) => {
  const validation = useValidationRow(rowPathSuffix);
  return (
    <>
      <SelectRow row={row} {...props} className={styleMessageRow(validation)} />
      <MessageRow columnCount={row.getVisibleCells().length} message={toMessageData(validation)} />
    </>
  );
};

type ValidationReorderRowProps<TData> = ComponentPropsWithoutRef<typeof ReorderRow<TData>> & ValidationProps<TData>;

export const ValidationSelectableReorderRow = <TData extends object>({
  rowPathSuffix,
  row,
  ...props
}: ValidationReorderRowProps<TData>) => {
  const validation = useValidationRow(rowPathSuffix);
  return (
    <>
      <ReorderRow row={row} {...props} className={styleMessageRow(validation)} />
      <MessageRow columnCount={row.getVisibleCells().length} message={toMessageData(validation)} />
    </>
  );
};
