import type { Variable, VariableInfo } from '@axonivy/process-editor-inscription-protocol';

export interface MappingTreeData extends Variable {
  value: string;
  children: MappingTreeData[];
  isLoaded: boolean;
}

export namespace MappingTreeData {
  export function of(paramInfo: VariableInfo): MappingTreeData[] {
    return paramInfo.variables.map(param => ({
      ...param,
      value: '',
      children: typesOfParam(paramInfo, param.type, [param.type]),
      isLoaded: true
    }));
  }

  export function loadChildrenFor(paramInfo: VariableInfo, paramType: string, tree: MappingTreeData[]): MappingTreeData[] {
    return tree.map(node => {
      if (node.isLoaded === false && node.type === paramType) {
        node.children = typesOfParam(paramInfo, paramType, [paramType]);
        node.isLoaded = true;
      } else {
        loadChildrenFor(paramInfo, paramType, node.children);
      }
      return node;
    });
  }

  const typesOfParam = (paramInfo: VariableInfo, paramType: string, checkParamTypes: Array<string> = []): MappingTreeData[] =>
    paramInfo.types[paramType]?.map(type => {
      const data = {
        ...type,
        value: '',
        children: [] as Array<MappingTreeData>,
        isLoaded: paramInfo.types[type.type] === undefined
      };
      if (data.isLoaded === false && !checkParamTypes.includes(data.type)) {
        data.children = typesOfParam(paramInfo, data.type, [...checkParamTypes, data.type]);
        data.isLoaded = true;
      }
      return data;
    }) ?? [];

  export function update(paramInfo: VariableInfo, tree: MappingTreeData[], mappingPath: string[], mappingValue: string): void {
    if (mappingPath.length >= 2 && mappingPath[0] === 'param' && tree.find(n => n.attribute.includes('.'))) {
      mappingPath.shift();
      mappingPath[0] = 'param.' + mappingPath[0];
    }
    updateValue(paramInfo, tree, mappingPath, mappingValue);
  }

  const updateValue = (paramInfo: VariableInfo, tree: MappingTreeData[], mappingPath: string[], mappingValue: string): void => {
    for (const node of tree) {
      if (node.attribute === mappingPath[0]) {
        mappingPath.shift();
        if (mappingPath.length === 0) {
          node.value = mappingValue;
        } else {
          if (node.isLoaded === false) {
            loadChildrenFor(paramInfo, node.type, tree);
          }
          return updateValue(paramInfo, node.children, mappingPath, mappingValue);
        }
      }
    }
    addUnknownValue(tree, mappingPath, mappingValue);
  };

  const addUnknownValue = (tree: MappingTreeData[], mappingPath: string[], mappingValue: string): void => {
    const attribute = mappingPath.shift();
    if (attribute) {
      if (mappingPath.length === 0) {
        tree.push({ attribute: attribute, type: '', simpleType: '', value: mappingValue, children: [], isLoaded: true, description: '' });
      } else {
        const children: MappingTreeData[] = [];
        tree.push({
          attribute: attribute,
          type: '',
          simpleType: '',
          value: '',
          children: children,
          isLoaded: true,
          description: ''
        });
        addUnknownValue(children, mappingPath, mappingValue);
      }
    }
  };

  export function updateDeep(data: MappingTreeData[], rows: number[], columnId: string, value: unknown): MappingTreeData[] {
    return data.map((row, index) => {
      const subRows = [...rows];
      const rowIndex = subRows.shift();
      if (index === rowIndex) {
        const rowData = data[rowIndex];
        if (subRows.length === 0) {
          return {
            ...rowData,
            [columnId]: value
          };
        } else {
          return {
            ...data[rowIndex],
            children: updateDeep(rowData.children, subRows, columnId, value)
          };
        }
      }
      return row;
    });
  }

  export function to(tree: MappingTreeData[]): Record<string, string> {
    const mappings: Record<string, string> = {};
    for (const node of tree) {
      if (node.value.length > 0) {
        mappings[node.attribute] = node.value;
      }
      for (const child of Object.entries(to(node.children))) {
        mappings[`${node.attribute}.${child[0]}`] = child[1];
      }
    }
    return mappings;
  }
}
