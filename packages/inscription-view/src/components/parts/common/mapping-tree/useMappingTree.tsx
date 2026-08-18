import type { VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { dataTreeHelper, ExpandableHeader, type DataTableFeatures } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTable, type ExpandedStateList, type ReactTable, type Row } from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deepEqual } from '../../../../utils/equals';
import type { BrowserType } from '../../../browser/useBrowser';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';
import { ExpandableCell } from '../../../widgets/table/cell/ExpandableCell';
import { ScriptCell } from '../../../widgets/table/cell/ScriptCell';
import { MappingTreeData } from './mapping-tree-data';

const { columnHelper, tableOptions } = dataTreeHelper<MappingTreeData>();

export const useMappingTree = (
  data: Record<string, string>,
  variableInfo: VariableInfo,
  onChange: (change: Record<string, string>) => void,
  browsers: BrowserType[]
) => {
  const { t } = useTranslation();
  const [treeData, setTreeData] = useState<MappingTreeData[]>(() => createTreeData(variableInfo, data));
  const [prevData, setPrevData] = useState(data);
  const [prevVariableInfo, setPrevVariableInfo] = useState(variableInfo);
  const [updateExpanded, setUpdateExpanded] = useState(true);

  const loadChildren = useCallback<(row: MappingTreeData) => void>(
    row => setTreeData(tree => MappingTreeData.loadChildrenFor(variableInfo, row.type, tree)),
    [variableInfo, setTreeData]
  );

  // useEffect(() => {
  //   const treeData = MappingTreeData.of(variableInfo);
  //   Object.entries(data).forEach(mapping => MappingTreeData.update(variableInfo, treeData, mapping[0].split('.'), mapping[1]));
  //   // eslint-disable-next-line @eslint-react/set-state-in-effect
  //   setTree(treeData);
  //   if (updateExpanded) {
  //     setExpanded(expandState(treeData));
  //   }
  // }, [data, variableInfo]);

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

  const tree = useTable({
    ...tableOptions,
    data: treeData,
    columns: columns,
    filterFromLeafRows: true,
    columnResizeMode: 'onChange',
    columnResizeDirection: 'ltr',
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableSubRowSelection: false,
    initialState: {
      expanded: expandState(treeData),
      columnFilters: [{ id: 'value', value: true }]
    },
    meta: {
      updateData: (rowId: string, columnId: string, value: unknown) => {
        if (typeof value !== 'string') {
          return;
        }
        const rowIndex = rowId.split('.').map(parseFloat);
        setUpdateExpanded(false);
        onChange(MappingTreeData.to(MappingTreeData.updateDeep(treeData, rowIndex, columnId, value)));
      }
    }
  });

  if (deepEqual(data, prevData) === false || deepEqual(variableInfo, prevVariableInfo) === false) {
    setPrevData(data);
    setPrevVariableInfo(variableInfo);
    const treeData = createTreeData(variableInfo, data);
    setTreeData(treeData);
    if (updateExpanded) {
      tree.setExpanded(expandState(treeData));
    }
  }

  return tree;
};

const createTreeData = (variableInfo: VariableInfo, data: Record<string, string>): MappingTreeData[] => {
  const treeData = MappingTreeData.of(variableInfo);
  Object.entries(data).forEach(mapping => MappingTreeData.update(variableInfo, treeData, mapping[0].split('.'), mapping[1]));
  return treeData;
};

export type TableFilter = {
  active: boolean;
  control: FieldsetControl;
};

export const useTableGlobalFilter = (table: ReactTable<DataTableFeatures, MappingTreeData>): TableFilter => {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);
  return {
    active: active,
    control: {
      label: t('common.label.search'),
      icon: IvyIcons.Search,
      active,
      action: () => {
        setActive(show => !show);
        table.setGlobalFilter('');
      }
    }
  };
};

export const useTableOnlyInscribed = (table: ReactTable<DataTableFeatures, MappingTreeData>): TableFilter => {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);
  return {
    active,
    control: {
      label: t('label.mapped'),
      icon: IvyIcons.Rule,
      active,
      action: () => {
        setActive(show => {
          const newShow = !show;
          table.setColumnFilters([{ id: 'value', value: show }]);
          return newShow;
        });
      }
    }
  };
};

export const calcFullPathId = (row: Row<DataTableFeatures, MappingTreeData>) => {
  return [...row.getParentRows().map(parent => parent.original.attribute), row.original.attribute].join('.');
};

export const expandState = (tree: Array<MappingTreeData>, path: string = '', expanded: ExpandedStateList = {}): ExpandedStateList => {
  expandStateDeep(tree, path, expanded);
  expanded['0'] = true;
  return expanded;
};

const expandStateDeep = (tree: Array<MappingTreeData>, path: string, expanded: ExpandedStateList): boolean => {
  let changed = false;
  tree.forEach((node, index) => {
    const id = `${path}${index}`;
    const childExpanded = expandStateDeep(node.children, `${id}.`, expanded);
    if (node.value.length > 0 || childExpanded) {
      expanded[id] = true;
      changed = true;
    }
  });
  return changed;
};
