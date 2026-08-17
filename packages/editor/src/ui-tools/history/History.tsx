// @jsxRuntime automatic
import { RequestHistoryAction, type HistoryNode } from '@axonivy/process-editor-protocol';
import { BasicField, ButtonGroup, Popover, PopoverAnchor, PopoverContent, Spinner, type ButtonProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Bounds, IActionDispatcher } from '@eclipse-glsp/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryTree } from './HistoryTree';
import { PinnedHistory } from './PinnedHistory';
import {
  addLazyPlaceholderNodes,
  createLazyDataRequest,
  isLazyPlaceholderNode,
  mergeHistorySubtree,
  type LazyPlaceholderState
} from './history-tree-state';
import { useHistoryPinnedState } from './useHistoryPinnedState';

type HistoryPopoverProps = Omit<HistoryProps, 'togglePinned'> & {
  containerElement: HTMLElement;
  bounds: Bounds;
};

export const HistoryPopover = ({ bounds, containerElement, ...props }: HistoryPopoverProps) => {
  const { pinned, togglePinned } = useHistoryPinnedState();

  const history = <HistoryContent togglePinned={togglePinned} {...props} />;
  if (pinned) {
    return <PinnedHistory>{history}</PinnedHistory>;
  }
  return (
    <Popover open={true}>
      <PopoverAnchor asChild>
        <div
          style={{
            top: `${bounds.y - 6}px`,
            left: `${bounds.x - 6}px`,
            height: `${bounds.height + 12}px`,
            width: `${bounds.width + 12}px`
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        side='bottom'
        align='center'
        sideOffset={10}
        collisionPadding={8}
        container={containerElement}
        collisionBoundary={containerElement}
        onEscapeKeyDown={props.closeHistory}
      >
        {history}
      </PopoverContent>
    </Popover>
  );
};

type HistoryProps = {
  actionDispatcher: IActionDispatcher;
  app: string;
  project: string;
  pid: string;
  togglePinned: () => void;
  closeHistory: () => void;
};

export const HistoryContent = ({ actionDispatcher, togglePinned, closeHistory, app, project, pid }: HistoryProps) => {
  const { t } = useTranslation();
  const [searchActive, setSearchActive] = useState(false);
  const { data, isSuccess, isPending, isError, lazyStatesByParentId, loadLazyNodeData, refreshHistory } = useLazyHistory({
    actionDispatcher,
    app,
    project,
    pid
  });
  const loadLazyNode = useCallback((node: HistoryNode) => loadLazyNodeData(node), [loadLazyNodeData]);
  const treeData = useMemo(() => (data ? addLazyPlaceholderNodes(data, lazyStatesByParentId) : []), [data, lazyStatesByParentId]);

  const successActions: Array<ButtonProps> = [
    {
      title: t('common.label.search'),
      'aria-label': t('common.label.search'),
      icon: IvyIcons.Search,
      toggle: searchActive,
      onClick: () => setSearchActive(show => !show)
    },
    {
      title: t('common.label.refresh'),
      'aria-label': t('common.label.refresh'),
      icon: IvyIcons.Reset,
      onClick: refreshHistory
    }
  ];

  return (
    <BasicField
      label={`History of '${pid}'`}
      control={
        <ButtonGroup
          controls={[
            ...(isSuccess ? successActions : []),
            {
              title: t('common.label.pin'),
              'aria-label': t('common.label.pin'),
              icon: IvyIcons.WindowMinimize,
              onClick: togglePinned
            },
            {
              title: t('common.label.close'),
              'aria-label': t('common.label.close'),
              icon: IvyIcons.Close,
              onClick: closeHistory
            }
          ]}
        />
      }
    >
      {isPending && <Spinner size='small' />}
      {isError && <div>{t('history.error')}</div>}
      {isSuccess && data && <HistoryTree data={treeData} searchActive={searchActive} onLoadLazyNode={loadLazyNode} />}
    </BasicField>
  );
};

type HistoryResponse = {
  historyNodes: Array<HistoryNode>;
};

type UseLazyHistoryOptions = {
  actionDispatcher: IActionDispatcher;
  app: string;
  project: string;
  pid: string;
};

const emptyTransientState = (): Record<string, LazyPlaceholderState> => ({});

const useLazyHistory = ({ actionDispatcher, app, project, pid }: UseLazyHistoryOptions) => {
  const queryClient = useQueryClient();
  const [lazyStatesByParentId, setLazyStatesByParentId] = useState<Record<string, LazyPlaceholderState>>(emptyTransientState);
  const rootQueryKey = createHistoryRootQueryKey(app, project, pid);
  const lazyQueryKeyPrefix = createHistoryLazyQueryKeyPrefix(app, project, pid);
  const query = useQuery({
    queryKey: rootQueryKey,
    queryFn: async () => (await actionDispatcher.request(RequestHistoryAction.create({ elementId: pid }))).historyNodes
  });
  const data = useMemo(
    () => (query.data ? hydrateHistoryNodes(query.data, queryClient, lazyQueryKeyPrefix) : undefined),
    [lazyQueryKeyPrefix, query.data, queryClient]
  );

  const loadLazyNodeData = useCallback(
    async (node: HistoryNode) => {
      const lazyQueryKey = createHistoryLazyQueryKey(app, project, pid, node.id);
      const lazyQueryState = queryClient.getQueryState<HistoryResponse>(lazyQueryKey);
      if (
        lazyQueryState?.fetchStatus === 'fetching' ||
        lazyQueryState?.data ||
        node.children.some(child => !isLazyPlaceholderNode(child))
      ) {
        return;
      }

      const lazyDataRequest = createLazyDataRequest(node);
      if (!lazyDataRequest) {
        setLazyStatesByParentId(state => ({ ...state, [node.id]: 'error' }));
        return;
      }

      setLazyStatesByParentId(state => ({ ...state, [node.id]: 'loading' }));

      try {
        const response = await queryClient.fetchQuery({
          queryKey: lazyQueryKey,
          queryFn: () =>
            actionDispatcher.request(
              RequestHistoryAction.create({
                elementId: pid,
                lazyDataRequest
              })
            ),
          staleTime: Infinity,
          gcTime: 10 * 60 * 1000
        });
        const subtreeRoot = getLazySubtreeRoot(response);
        if (!subtreeRoot) {
          throw new Error('Invalid lazy history response');
        }

        queryClient.setQueryData<Array<HistoryNode>>(rootQueryKey, currentNodes => {
          if (!currentNodes) {
            console.warn(`Skipping lazy history merge for node '${node.id}' because the root history cache is no longer available.`);
            return currentNodes;
          }

          const mergedHistoryNodes = mergeHistorySubtree(currentNodes, subtreeRoot);
          if (!mergedHistoryNodes) {
            console.warn(
              `Skipping lazy history merge for node '${node.id}' because the subtree root is no longer present in the root history cache.`
            );
            return currentNodes;
          }

          return mergedHistoryNodes;
        });

        setLazyStatesByParentId(state => removeRecordKey(state, node.id));
      } catch {
        setLazyStatesByParentId(state => ({ ...state, [node.id]: 'error' }));
      }
    },
    [actionDispatcher, app, pid, project, queryClient, rootQueryKey]
  );

  const { refetch } = query;
  const refreshHistory = useCallback(() => {
    queryClient.removeQueries({ queryKey: lazyQueryKeyPrefix, exact: false });
    setLazyStatesByParentId(emptyTransientState());
    return refetch();
  }, [lazyQueryKeyPrefix, queryClient, refetch]);

  return {
    data,
    isError: query.isError,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    lazyStatesByParentId,
    loadLazyNodeData,
    refreshHistory
  };
};

const createHistoryRootQueryKey = (app: string, project: string, pid: string) => ['process', 'history', app, project, pid] as const;

const createHistoryLazyQueryKeyPrefix = (app: string, project: string, pid: string) =>
  ['process', 'history', 'lazy', app, project, pid] as const;

const createHistoryLazyQueryKey = (app: string, project: string, pid: string, nodeId: string) =>
  [...createHistoryLazyQueryKeyPrefix(app, project, pid), nodeId] as const;

const getLazySubtreeRoot = (response: HistoryResponse): HistoryNode | undefined => {
  const subtreeRoot = response.historyNodes[0];
  return response.historyNodes.length === 1 ? subtreeRoot : undefined;
};

const hydrateHistoryNodes = (
  historyNodes: Array<HistoryNode>,
  queryClient: ReturnType<typeof useQueryClient>,
  lazyQueryKeyPrefix: ReturnType<typeof createHistoryLazyQueryKeyPrefix>
) => {
  let hydratedNodes = historyNodes;
  const cachedLazyQueries = queryClient.getQueriesData<HistoryResponse>({ queryKey: lazyQueryKeyPrefix, exact: false });

  cachedLazyQueries.forEach(([, response]) => {
    const subtreeRoot = response ? getLazySubtreeRoot(response) : undefined;
    if (!subtreeRoot) {
      return;
    }

    const mergedHistoryNodes = mergeHistorySubtree(hydratedNodes, subtreeRoot);
    if (mergedHistoryNodes) {
      hydratedNodes = mergedHistoryNodes;
    }
  });

  return hydratedNodes;
};

const removeRecordKey = <T extends Record<string, LazyPlaceholderState>>(record: T, key: string): T => {
  const { [key]: removed, ...rest } = record;
  void removed;
  return rest as T;
};
