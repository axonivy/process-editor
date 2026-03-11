import type { HistoryNode } from '@axonivy/process-editor-protocol';
import { expect, test } from 'vitest';
import { createLazyDataRequest, lastLeafPathExpandedState, mergeHistorySubtree } from './history-tree-state';

const createNode = (overrides: Partial<HistoryNode> & Pick<HistoryNode, 'id' | 'type' | 'description'>): HistoryNode => ({
  id: overrides.id,
  type: overrides.type,
  description: overrides.description,
  expandable: overrides.expandable ?? false,
  requestId: overrides.requestId,
  executionTime: overrides.executionTime,
  dataPath: overrides.dataPath,
  children: overrides.children ?? []
});

test('mergeHistorySubtree replaces only the matching branch by id', () => {
  const lazyRoot = createNode({
    id: 'lazy-root',
    type: 'DATA',
    description: 'customer = Data()',
    expandable: true,
    requestId: 'req-1',
    executionTime: '2026-03-11T10:00:00.000Z',
    dataPath: 'in.orders.0.customer'
  });
  const sibling = createNode({ id: 'sibling', type: 'DATA', description: 'price = null' });
  const tree = [createNode({ id: 'request', type: 'REQUEST_FINISHED', description: 'request', children: [lazyRoot, sibling] })];

  const subtree = createNode({
    ...lazyRoot,
    children: [createNode({ id: 'child', type: 'DATA', description: 'name = Luke' })]
  });

  const merged = mergeHistorySubtree(tree, subtree);

  expect(merged).toEqual([
    createNode({
      id: 'request',
      type: 'REQUEST_FINISHED',
      description: 'request',
      children: [subtree, sibling]
    })
  ]);
});

test('createLazyDataRequest builds the backend payload from node metadata', () => {
  const node = createNode({
    id: 'lazy-root',
    type: 'DATA',
    description: 'customer = Data()',
    expandable: true,
    requestId: 'req-1',
    executionTime: '2026-03-11T10:00:00.000Z',
    dataPath: 'in.orders.0.customer'
  });

  expect(createLazyDataRequest(node)).toEqual({
    requestId: 'req-1',
    executionTime: '2026-03-11T10:00:00.000Z',
    dataPath: 'in.orders.0.customer'
  });
});

test('lastLeafPathExpandedState uses stable node ids', () => {
  const tree = [
    createNode({
      id: 'request',
      type: 'REQUEST_FINISHED',
      description: 'request',
      children: [
        createNode({
          id: 'data',
          type: 'DATA',
          description: 'in = Data()',
          children: [createNode({ id: 'leaf', type: 'DATA', description: 'price = 42' })]
        })
      ]
    })
  ];

  expect(lastLeafPathExpandedState(tree)).toEqual({ request: true, data: true, leaf: true });
});
