import { type DataTableFeatures, Flex, useEditCell } from '@axonivy/ui-components';
import type { CellContext, RowData } from '@tanstack/react-table';
import { usePath } from '../../../../context/usePath';
import Browser from '../../../browser/Browser';
import { useBrowser } from '../../../browser/useBrowser';
import { Input } from '../../input/Input';

type BrowserInputCellProps<TData extends RowData> = {
  cell: CellContext<DataTableFeatures, TData, string>;
};

export function BrowserInputCell<TData extends RowData>({ cell }: BrowserInputCellProps<TData>) {
  const { value, setValue, updateValue, onBlur, className: editCell } = useEditCell(cell);
  const browser = useBrowser();
  const path = usePath();

  return (
    <Flex direction='row' justifyContent='space-between' alignItems='center'>
      <Input value={value} onChange={change => setValue(change)} onBlur={onBlur} title={value} className={editCell} />
      {cell.row.getIsSelected() && <Browser {...browser} types={['type']} accept={change => updateValue(change.value)} location={path} />}
    </Flex>
  );
}
