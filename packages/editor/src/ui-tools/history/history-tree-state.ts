import type { HistoryNode, LazyDataRequest } from '@axonivy/process-editor-protocol';
import type { ExpandedState } from '@tanstack/react-table';

export type HistoryLazyState = {
  loadedById: Record<string, boolean>;
  loadingById: Record<string, boolean>;
  errorById: Record<string, string>;
};

export const collectLoadedLazyNodeIds = (nodes: Array<HistoryNode>, loadedById: Record<string, boolean> = {}): Record<string, boolean> => {
  nodes.forEach(node => {
    if (isExpandableDataNode(node) && node.children.length > 0) {
      loadedById[node.id] = true;
    }
    collectLoadedLazyNodeIds(node.children, loadedById);
  });
  return loadedById;
};

export const isExpandableDataNode = (node: HistoryNode) => node.type === 'DATA' && node.expandable;

export const isHistoryNodeLoaded = (node: HistoryNode, lazyState: HistoryLazyState) =>
  !isExpandableDataNode(node) || node.children.length > 0 || lazyState.loadedById[node.id] === true;

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

export const lastLeafPathExpandedState = (nodes: Array<HistoryNode>) => {
  const state: ExpandedState = {};
  let current = nodes;

  while (current.length > 0) {
    const lastNode = current[current.length - 1];
    if (!lastNode) {
      break;
    }
    state[lastNode.id] = true;
    current = lastNode.children;
  }

  return state;
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
