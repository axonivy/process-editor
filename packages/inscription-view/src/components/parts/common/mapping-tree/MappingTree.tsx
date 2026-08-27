import { TableBody, TableCell, TableResizableHeader, type DataTableFeatures } from '@axonivy/ui-components';
import type { ReactTable } from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';
import { memo } from 'react';
import { SearchTable } from '../../../widgets/table/table/Table';
import { ValidationRow } from '../path/validation/ValidationRow';
import { MappingTreeData } from './mapping-tree-data';
import { calcFullPathId } from './useMappingTree';

type MappingTreeProps = {
  tree: ReactTable<DataTableFeatures, MappingTreeData>;
  globalFilterActive: boolean;
};

const MappingTree = ({ tree, globalFilterActive }: MappingTreeProps) => {
  return (
    <SearchTable
      table={tree}
      searchActive={globalFilterActive}
      onSearchChange={filter => tree.setExpanded(filter.length > 0 ? true : { 0: true })}
    >
      <TableResizableHeader headerGroups={tree.getHeaderGroups()} onClick={() => tree.setRowSelection({})} />
      <TableBody>
        {tree.getRowModel().rows.map(row => (
          <ValidationRow row={row} key={row.id} rowPathSuffix={calcFullPathId(row)}>
            {row.getVisibleCells().map(cell => (
              <TableCell key={cell.id} style={{ width: cell.column.getSize() }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </ValidationRow>
        ))}
      </TableBody>
    </SearchTable>
  );
};

export default memo(MappingTree);
