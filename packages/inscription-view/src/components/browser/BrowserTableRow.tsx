import { type DataTableFeatures, SelectRow, TableCell, TableRow } from '@axonivy/ui-components';
import { flexRender, type Row, type RowData } from '@tanstack/react-table';

const BrowserTableRow = <TData extends RowData & { notSelectable?: boolean },>({
  row,
  onDoubleClick
}: {
  row: Row<DataTableFeatures, TData>;
  onDoubleClick: () => void;
}) => (
  <>
    {row.original.notSelectable ? (
      <TableRow>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </TableRow>
    ) : (
      <SelectRow row={row} onDoubleClick={onDoubleClick}>
        {row.getVisibleCells().map(cell => (
          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
        ))}
      </SelectRow>
    )}
  </>
);

export default BrowserTableRow;
