import type { DataTableFeatures } from '@axonivy/ui-components';
import type { CellContext, RowData } from '@tanstack/react-table';
import { CodeEditorCell } from './CodeEditorCell';

export const MacroCell = <TData extends RowData,>({
  cell,
  placeholder
}: {
  cell: CellContext<DataTableFeatures, TData, string | undefined>;
  placeholder?: string;
}) => (
  <CodeEditorCell cell={cell} macro={true} browsers={['attr', 'func', 'cms']} placeholder={placeholder} />
);
