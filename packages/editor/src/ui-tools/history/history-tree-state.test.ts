import type { HistoryNode } from '@axonivy/process-editor-protocol';
import { expect, test } from 'vitest';
import { addLazyPlaceholderNodes, createLazyDataRequest, mergeHistorySubtree } from './history-tree-state';

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

test('adds a loading placeholder child for an unloaded expandable data node', () => {
  const tree = [
    createNode({
      id: 'data',
      type: 'DATA',
      description: 'in = Data()',
      expandable: true,
      requestId: 'req-1',
      executionTime: '2026-03-11T10:00:00.000Z',
      dataPath: 'in'
    })
  ];

  expect(addLazyPlaceholderNodes(tree, {})).toMatchObject([
    {
      id: 'data',
      children: [
        {
          id: 'lazy-placeholder:data',
          description: 'idle',
          lazyPlaceholderState: 'idle'
        }
      ]
    }
  ]);
});
