import { expect, test } from 'vitest';
import { MappingTreeData } from './mapping-tree-data';
import { expandState } from './useMappingTree';

const tree = (mailValue = ''): MappingTreeData[] => [
  {
    attribute: 'param.procurementRequest',
    children: [
      { attribute: 'accepted', children: [], value: '', type: 'Boolean', simpleType: 'Boolean', isLoaded: true, description: '' },
      { attribute: 'amount', children: [], value: '', type: 'Number', simpleType: 'Number', isLoaded: true, description: '' },
      {
        attribute: 'requester',
        children: [
          { attribute: 'email', children: [], value: mailValue, type: 'String', simpleType: 'String', isLoaded: true, description: '' }
        ],
        value: '',
        type: 'workflow.humantask.User',
        simpleType: 'User',
        isLoaded: true,
        description: ''
      }
    ],
    value: '',
    type: 'workflow.humantask.ProcurementRequest',
    simpleType: 'ProcurementRequest',
    isLoaded: true,
    description: ''
  }
];

const treeWithDirectIdValue: MappingTreeData[] = [
  {
    attribute: 'param',
    children: [
      {
        attribute: 'category',
        children: [
          { attribute: 'id', children: [], value: '', type: 'Long', simpleType: 'Long', isLoaded: true, description: '' },
          { attribute: 'name', children: [], value: '', type: 'String', simpleType: 'String', isLoaded: true, description: '' }
        ],
        value: '',
        type: 'api.v3.client.Category',
        simpleType: 'Category',
        isLoaded: true,
        description: ''
      },
      { attribute: 'id', children: [], value: 'CH', type: 'String', simpleType: 'String', isLoaded: true, description: '' }
    ],
    value: '',
    type: 'api.v3.client.Pet',
    simpleType: 'Pet',
    isLoaded: true,
    description: ''
  }
];

test('expandState', () => {
  expect(expandState([])).toEqual({ '0': true });
  expect(expandState(tree())).toEqual({ '0': true });
  expect(expandState(tree('louis'))).toEqual({ '0': true, '0.2': true });
  expect(expandState(treeWithDirectIdValue)).toEqual({ '0': true });
});
