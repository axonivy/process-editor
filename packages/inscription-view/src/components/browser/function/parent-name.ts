import type { Function } from '@axonivy/process-editor-inscription-protocol';
import type { DataTableFeatures } from '@axonivy/ui-components';
import type { Row } from '@tanstack/react-table';

export const getParentNames = (currentRow: Row<DataTableFeatures, Function>, parentNames: string[] = []): string[] => {
  parentNames.push(
    currentRow.original.isField
      ? currentRow.original.name
      : currentRow.original.name + '(' + currentRow.original.params.map(param => param.type.split('.').pop()).join(', ') + ')'
  );
  const parentRow = currentRow.getParentRow();
  if (parentRow !== undefined) {
    return getParentNames(parentRow, parentNames);
  }
  return parentNames;
};
