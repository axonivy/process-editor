import type { HistoryNode, LazyDataRequest } from '@axonivy/process-editor-protocol';
export const LAZY_PLACEHOLDER_PREFIX = 'lazy-placeholder:';

export type LazyPlaceholderState = 'idle' | 'loading' | 'error';

export type LazyHistoryNode = HistoryNode & {
  lazyPlaceholderState?: LazyPlaceholderState;
  lazyParent?: HistoryNode;
};

export const isExpandableDataNode = (node: HistoryNode) => node.type === 'DATA' && node.expandable;

export const createLazyPlaceholderNode = (parent: HistoryNode, state: LazyPlaceholderState): LazyHistoryNode => ({
  id: `${LAZY_PLACEHOLDER_PREFIX}${parent.id}`,
  type: 'DATA',
  description: state,
  expandable: true,
  children: [],
  lazyPlaceholderState: state,
  lazyParent: parent
});

export const isLazyPlaceholderNode = (node: HistoryNode): node is LazyHistoryNode => node.id.startsWith(LAZY_PLACEHOLDER_PREFIX);

export const addLazyPlaceholderNodes = (
  nodes: Array<HistoryNode>,
  statesByParentId: Record<string, LazyPlaceholderState>
): Array<LazyHistoryNode> =>
  nodes.map(node => {
    const children = addLazyPlaceholderNodes(node.children, statesByParentId);
    if (!isExpandableDataNode(node) || node.children.length > 0) {
      return { ...node, children };
    }

    return {
      ...node,
      children: [createLazyPlaceholderNode(node, statesByParentId[node.id] ?? 'idle')]
    };
  });

export const createLazyDataRequest = (node: HistoryNode): LazyDataRequest | undefined => {
  if (!isExpandableDataNode(node) || !node.requestId || !node.executionTime || !node.dataPath) {
    return undefined;
  }

  const executionTime = Date.parse(node.executionTime);
  if (Number.isNaN(executionTime)) {
    return undefined;
  }

  return {
    requestId: node.requestId,
    executionTime: new Date(executionTime).toISOString(),
    dataPath: node.dataPath
  };
};

export const mergeHistorySubtree = (nodes: Array<HistoryNode>, subtreeRoot: HistoryNode): Array<HistoryNode> | undefined => {
  const result = replaceHistoryNode(nodes, subtreeRoot);
  return result.replaced ? result.nodes : undefined;
};

const replaceHistoryNode = (nodes: Array<HistoryNode>, subtreeRoot: HistoryNode): { nodes: Array<HistoryNode>; replaced: boolean } => {
  let replaced = false;

  const nextNodes = nodes.map(node => {
    if (node.id === subtreeRoot.id) {
      replaced = true;
      return subtreeRoot;
    }

    const childResult = replaceHistoryNode(node.children, subtreeRoot);
    if (childResult.replaced) {
      replaced = true;
      return { ...node, children: childResult.nodes };
    }

    return node;
  });

  return replaced ? { nodes: nextNodes, replaced: true } : { nodes, replaced: false };
};
