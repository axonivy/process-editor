import { RequestHistoryAction, type HistoryNode } from '@axonivy/process-editor-protocol';
import { BasicField, ButtonGroup, Popover, PopoverAnchor, PopoverContent, Spinner, type ButtonProps } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Bounds, IActionDispatcher } from '@eclipse-glsp/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { ExpandedState, OnChangeFn } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HistoryTree } from './HistoryTree';
import { PinnedHistory } from './PinnedHistory';
import {
  collectLoadedLazyNodeIds,
  createLazyDataRequest,
  lastLeafPathExpandedState,
  mergeHistorySubtree,
  type HistoryLazyState
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
  pmv: string;
  pid: string;
  togglePinned: () => void;
  closeHistory: () => void;
};

export const HistoryContent = ({ actionDispatcher, togglePinned, closeHistory, app, pmv, pid }: HistoryProps) => {
  const { t } = useTranslation();
  const [searchActive, setSearchActive] = useState(false);
  const [expandedByPid, setExpandedByPid] = useState<Record<string, ExpandedState>>({});
  const { data, isSuccess, isPending, isError, lazyState, loadLazyNodeData, refreshHistory } = useLazyHistory({
    actionDispatcher,
    app,
    pmv,
    pid
  });
  const expanded = useMemo(() => expandedByPid[pid] ?? (data ? lastLeafPathExpandedState(data) : {}), [data, expandedByPid, pid]);

  const onExpandedChange = useCallback<OnChangeFn<ExpandedState>>(
    updater => {
      setExpandedByPid(current => ({
        ...current,
        [pid]: typeof updater === 'function' ? updater(expanded) : updater
      }));
    },
    [expanded, pid]
  );

  const loadLazyNode = useCallback(
    async (node: HistoryNode) => {
      setExpandedByPid(current => ({
        ...current,
        [pid]: setExpandedNode(current[pid] ?? (data ? lastLeafPathExpandedState(data) : {}), node.id, true)
      }));
      const result = await loadLazyNodeData(node);
      if (result === 'error' || result === 'invalid') {
        setExpandedByPid(current => ({
          ...current,
          [pid]: setExpandedNode(current[pid] ?? (data ? lastLeafPathExpandedState(data) : {}), node.id, false)
        }));
      }
    },
    [data, loadLazyNodeData, pid]
  );

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
      {isSuccess && data && (
        <HistoryTree
          data={data}
          searchActive={searchActive}
          expanded={expanded}
          onExpandedChange={onExpandedChange}
          lazyState={lazyState}
          onLoadLazyNode={loadLazyNode}
        />
      )}
    </BasicField>
  );
};

const setExpandedNode = (state: ExpandedState, nodeId: string, isExpanded: boolean): ExpandedState => {
  if (state === true) {
    return state;
  }
  return { ...state, [nodeId]: isExpanded };
};

type HistoryResponse = {
  historyNodes: Array<HistoryNode>;
};

type HistoryTransientState = Pick<HistoryLazyState, 'loadingById' | 'errorById'>;

type HistoryLazyLoadResult = 'error' | 'invalid' | 'loaded' | 'skipped';

type UseLazyHistoryOptions = {
  actionDispatcher: IActionDispatcher;
  app: string;
  pmv: string;
  pid: string;
};

const emptyTransientState = (): HistoryTransientState => ({ loadingById: {}, errorById: {} });

const useLazyHistory = ({ actionDispatcher, app, pmv, pid }: UseLazyHistoryOptions) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [transientState, setTransientState] = useState<HistoryTransientState>(emptyTransientState);
  const rootQueryKey = createHistoryRootQueryKey(app, pmv, pid);
  const lazyQueryKeyPrefix = createHistoryLazyQueryKeyPrefix(app, pmv, pid);
  const query = useQuery({
    queryKey: rootQueryKey,
    queryFn: async () => (await actionDispatcher.request(RequestHistoryAction.create({ elementId: pid }))).historyNodes
  });
  const data = useMemo(
    () => (query.data ? hydrateHistoryNodes(query.data, queryClient, lazyQueryKeyPrefix) : undefined),
    [lazyQueryKeyPrefix, query.data, queryClient]
  );

  const loadedById = useMemo(() => collectLoadedLazyNodeIds(data ?? []), [data]);
  const lazyState = useMemo<HistoryLazyState>(
    () => ({
      loadedById,
      loadingById: transientState.loadingById,
      errorById: transientState.errorById
    }),
    [loadedById, transientState.errorById, transientState.loadingById]
  );

  const loadLazyNodeData = useCallback(
    async (node: HistoryNode): Promise<HistoryLazyLoadResult> => {
      const lazyQueryKey = createHistoryLazyQueryKey(app, pmv, pid, node.id);
      const lazyQueryState = queryClient.getQueryState<HistoryResponse>(lazyQueryKey);
      if (lazyQueryState?.fetchStatus === 'fetching' || lazyQueryState?.data || loadedById[node.id]) {
        return 'skipped';
      }

      const lazyDataRequest = createLazyDataRequest(node);
      if (!lazyDataRequest) {
        setTransientState(state => ({
          ...state,
          errorById: { ...state.errorById, [node.id]: t('history.lazyInvalid') }
        }));
        return 'invalid';
      }

      setTransientState(state => ({
        loadingById: { ...state.loadingById, [node.id]: true },
        errorById: removeRecordKey(state.errorById, node.id)
      }));

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

        setTransientState(state => ({
          loadingById: removeRecordKey(state.loadingById, node.id),
          errorById: removeRecordKey(state.errorById, node.id)
        }));
        return 'loaded';
      } catch {
        setTransientState(state => ({
          loadingById: removeRecordKey(state.loadingById, node.id),
          errorById: { ...state.errorById, [node.id]: t('history.lazyLoadError') }
        }));
        return 'error';
      }
    },
    [actionDispatcher, app, loadedById, pid, pmv, queryClient, rootQueryKey, t]
  );

  const { refetch } = query;
  const refreshHistory = useCallback(() => {
    queryClient.removeQueries({ queryKey: lazyQueryKeyPrefix, exact: false });
    setTransientState(emptyTransientState());
    return refetch();
  }, [lazyQueryKeyPrefix, queryClient, refetch]);

  return {
    data,
    isError: query.isError,
    isPending: query.isPending,
    isSuccess: query.isSuccess,
    lazyState,
    loadLazyNodeData,
    refreshHistory
  };
};

const createHistoryRootQueryKey = (app: string, pmv: string, pid: string) => ['process', 'history', app, pmv, pid] as const;

const createHistoryLazyQueryKeyPrefix = (app: string, pmv: string, pid: string) => ['process', 'history', 'lazy', app, pmv, pid] as const;

const createHistoryLazyQueryKey = (app: string, pmv: string, pid: string, nodeId: string) =>
  [...createHistoryLazyQueryKeyPrefix(app, pmv, pid), nodeId] as const;

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

const removeRecordKey = <T extends Record<string, boolean | string>>(record: T, key: string): T => {
  const { [key]: removed, ...rest } = record;
  void removed;
  return rest as T;
};
