import { Button, type DataTableFeatures, Flex, InputCell } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { CellContext, RowData } from '@tanstack/react-table';
import type { BrowserType } from '../../../browser/useBrowser';
import { CodeEditorCell } from './CodeEditorCell';

export const ScriptCell = <TData extends RowData,>({
  cell,
  type,
  browsers,
  placeholder
}: {
  cell: CellContext<DataTableFeatures, TData, string | undefined>;
  type: string;
  browsers: BrowserType[];
  placeholder?: string;
}) => {
  if (type === undefined || type.length === 0) {
    return (
      <Flex
        justifyContent='space-between'
        alignItems='center'
        gap={1}
        className='code-input'
        style={{
          paddingRight: 'var(--size-1)'
        }}
      >
        <InputCell className='script-cell view-lines' cell={cell} placeholder={placeholder} />
        <Button icon={IvyIcons.Trash} onClick={() => cell.table.options.meta?.updateData(cell.row.id, cell.column.id, '')} />
      </Flex>
    );
  }
  return <CodeEditorCell cell={cell} macro={false} type={type} browsers={browsers} placeholder={placeholder} />;
};
