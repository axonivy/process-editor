import { MappingTreeData } from './mapping-tree-data';
import { test, expect } from 'vitest';
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

test('expandState', () => {
  expect(expandState([])).toEqual({ '0': true });
  expect(expandState(tree())).toEqual({ '0': true });
  expect(expandState(tree('louis'))).toEqual({ '0': true, '0.2': true, '0.2.0': true });
});
