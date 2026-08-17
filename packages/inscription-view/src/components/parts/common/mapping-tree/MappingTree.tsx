import { dataTreeHelper, ExpandableHeader, TableBody, TableCell, TableResizableHeader } from '@axonivy/ui-components';
import type { ColumnFiltersState } from '@tanstack/react-table';
import { flexRender, useTable } from '@tanstack/react-table';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ExpandableCell } from '../../../widgets/table/cell/ExpandableCell';
import { ScriptCell } from '../../../widgets/table/cell/ScriptCell';
import { SearchTable } from '../../../widgets/table/table/Table';
import { ValidationRow } from '../path/validation/ValidationRow';
import { MappingTreeData } from './mapping-tree-data';
import type { MappingPartProps } from './MappingPart';
import type { TableFilter } from './useMappingTree';
import { calcFullPathId } from './useMappingTree';

type MappingTreeProps = MappingPartProps & {
  globalFilter: TableFilter<string>;
  onlyInscribedFilter: TableFilter<ColumnFiltersState>;
};

const { columnHelper, tableOptions } = dataTreeHelper<MappingTreeData>();

const MappingTree = ({ data, variableInfo, onChange, globalFilter, onlyInscribedFilter, browsers }: MappingTreeProps) => {
  const { t } = useTranslation();
  const [tree, setTree] = useState<MappingTreeData[]>([]);

  const loadChildren = useCallback<(row: MappingTreeData) => void>(
    row => setTree(tree => MappingTreeData.loadChildrenFor(variableInfo, row.type, tree)),
    [variableInfo, setTree]
  );

  useEffect(() => {
    const treeData = MappingTreeData.of(variableInfo);
    Object.entries(data).forEach(mapping => MappingTreeData.update(variableInfo, treeData, mapping[0].split('.'), mapping[1]));
    // eslint-disable-next-line @eslint-react/set-state-in-effect
    setTree(treeData);
  }, [data, variableInfo]);

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.accessor('attribute', {
          header: header => <ExpandableHeader header={header} name={t('common.label.attribute')} />,
          cell: cell => (
            <ExpandableCell
              cell={cell}
              isLoaded={cell.row.original.isLoaded}
              loadChildren={() => loadChildren(cell.row.original)}
              isUnknown={cell.row.original.type.length === 0}
              title={cell.row.original.description}
            />
          ),
          size: 100,
          minSize: 60
        }),
        columnHelper.accessor('value', {
          header: () => <span>{t('label.expression')}</span>,
          cell: cell => <ScriptCell cell={cell} type={cell.row.original.type} browsers={browsers} placeholder={cell.row.original.type} />,
          filterFn: (row, columnId, filterValue) => filterValue || row.original.value.length > 0
        })
      ]),
    [browsers, loadChildren, t]
  );

  const table = useTable({
    ...tableOptions,
    data: tree,
    columns: columns,
    filterFromLeafRows: true,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    initialState: {
      expanded: { 0: true }
    },
    state: {
      columnFilters: onlyInscribedFilter.filter
    },
    meta: {
      updateData: (rowId: string, columnId: string, value: unknown) => {
        if (typeof value !== 'string') {
          return;
        }
        const rowIndex = rowId.split('.').map(parseFloat);
        onChange(MappingTreeData.to(MappingTreeData.updateDeep(tree, rowIndex, columnId, value)));
      }
    }
  });

  return (
    <SearchTable
      table={table}
      searchActive={globalFilter.active}
      onSearchChange={filter => table.setExpanded(filter.length > 0 ? true : { 0: true })}
    >
      <TableResizableHeader headerGroups={table.getHeaderGroups()} onClick={() => table.setRowSelection({})} />
      <TableBody>
        {table.getRowModel().rows.map(row => (
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
