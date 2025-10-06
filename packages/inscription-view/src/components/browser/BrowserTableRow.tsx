import { SelectRow, TableCell, TableRow, type BrowserNode } from '@axonivy/ui-components';
import { flexRender, type Row } from '@tanstack/react-table';

const BrowserTableRow = <T,>({ row, onDoubleClick }: { row: Row<T>; onDoubleClick: () => void }) => (
  <>
    {(row.original as BrowserNode).notSelectable ? (
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
