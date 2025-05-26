import type { Dispatch } from 'react';
import { useState } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ColumnFiltersState, ExpandedStateList, Row } from '@tanstack/react-table';
import { MappingTreeData } from './mapping-tree-data';
import type { FieldsetControl } from '../../../widgets/fieldset/fieldset-control';

export type TableFilter<TFilter> = {
  active: boolean;
  filter: TFilter;
  setFilter: Dispatch<React.SetStateAction<TFilter>>;
  control: FieldsetControl;
};

export const useTableGlobalFilter = (): TableFilter<string> => {
  const [active, setActive] = useState(false);
  const [filter, setFilter] = useState('');
  return {
    active: active,
    filter,
    setFilter,
    control: {
      label: 'Toggle Search',
      icon: IvyIcons.Search,
      active,
      action: () => {
        setActive(show => !show);
        setFilter('');
      }
    }
  };
};

export const useTableOnlyInscribed = (): TableFilter<ColumnFiltersState> => {
  const [active, setActive] = useState(false);
  const [filter, setFilter] = useState<ColumnFiltersState>([]);
  return {
    active,
    filter,
    setFilter,
    control: {
      label: 'Toggle Inscribed',
      icon: IvyIcons.Rule,
      active,
      action: () => {
        setActive(show => !show);
        setFilter([{ id: 'value', value: active }]);
      }
    }
  };
};

export const calcFullPathId = (row: Row<MappingTreeData>) => {
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
