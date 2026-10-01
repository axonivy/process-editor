import type { PredefinedCustomField, StartCustomStartField, WfCustomField } from '@axonivy/process-editor-inscription-protocol';
import type { DataTableFeatures } from '@axonivy/ui-components';
import type { ReactTable } from '@tanstack/react-table';

export const resolveProject = (
  table: ReactTable<DataTableFeatures, WfCustomField> | ReactTable<DataTableFeatures, StartCustomStartField>,
  predefinedCustomField: Array<PredefinedCustomField>
) => {
  const firstSelectedRow = table.getSelectedRowModel().rows[0];
  if (!firstSelectedRow) {
    return;
  }
  const predefinedField = predefinedCustomField.find(pcf => pcf.name === firstSelectedRow.original.name);
  if (!predefinedField) {
    return;
  }
  return predefinedField.project;
};
