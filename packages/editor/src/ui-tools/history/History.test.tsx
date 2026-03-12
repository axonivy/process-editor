import { RequestHistoryAction, type HistoryNode } from '@axonivy/process-editor-protocol';
import type { IActionDispatcher } from '@eclipse-glsp/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// eslint-disable-next-line testing-library/no-manual-cleanup
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { HistoryContent } from './History';

const createNode = (overrides: Partial<HistoryNode> & Pick<HistoryNode, 'id' | 'type' | 'description'>): HistoryNode => ({
  id: overrides.id,
  type: overrides.type,
  description: overrides.description,
  expandable: overrides.expandable ?? false,
  requestId: overrides.requestId,
  executionTime: overrides.executionTime,
  dataPath: overrides.dataPath,
  // eslint-disable-next-line testing-library/no-node-access
  children: overrides.children ?? []
});

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

const renderHistory = (request: ReturnType<typeof vi.fn>, options?: { pid?: string; queryClient?: QueryClient }) => {
  const queryClient = options?.queryClient ?? createQueryClient();
  const view = render(
    <QueryClientProvider client={queryClient}>
      <HistoryContent
        actionDispatcher={{ request } as unknown as IActionDispatcher}
        app='app'
        pmv='pmv'
        pid={options?.pid ?? 'pid'}
        togglePinned={() => undefined}
        closeHistory={() => undefined}
      />
    </QueryClientProvider>
  );

  return {
    queryClient,
    rerenderHistory: (pid: string) =>
      view.rerender(
        <QueryClientProvider client={queryClient}>
          <HistoryContent
            actionDispatcher={{ request } as unknown as IActionDispatcher}
            app='app'
            pmv='pmv'
            pid={pid}
            togglePinned={() => undefined}
            closeHistory={() => undefined}
          />
        </QueryClientProvider>
      )
  };
};

test('loads a lazy subtree and preserves sibling nodes', async () => {
  const lazyNode = createNode({
    id: 'lazy-root',
    type: 'DATA',
    description: 'customer = Data()',
    expandable: true,
    requestId: 'req-1',
    executionTime: '2026-03-11T10:00:00.000Z',
    dataPath: 'in.orders.0.customer'
  });
  const sibling = createNode({ id: 'sibling', type: 'DATA', description: 'price = null' });
  const request = vi
    .fn()
    .mockResolvedValueOnce({ historyNodes: [lazyNode, sibling] })
    .mockResolvedValueOnce({
      historyNodes: [
        createNode({
          ...lazyNode,
          children: [createNode({ id: 'loaded-child', type: 'DATA', description: 'name = Luke' })]
        })
      ]
    });

  renderHistory(request);

  await screen.findByText('customer = Data()');
  await screen.findByText('price = null');

  await userEvent.click(screen.getByLabelText('Expand row'));

  await waitFor(() =>
    expect(request).toHaveBeenNthCalledWith(
      2,
      RequestHistoryAction.create({
        elementId: 'pid',
        lazyDataRequest: {
          requestId: 'req-1',
          executionTime: '2026-03-11T10:00:00.000Z',
          dataPath: 'in.orders.0.customer'
        }
      })
    )
  );
  await screen.findByText('name = Luke');
  expect(screen.getByText('price = null')).not.toBeNull();
});

test('reuses cached lazy subtree when reopening a previously viewed element', async () => {
  const lazyNode = createNode({
    id: 'lazy-root',
    type: 'DATA',
    description: 'customer = Data()',
    expandable: true,
    requestId: 'req-1',
    executionTime: '2026-03-11T10:00:00.000Z',
    dataPath: 'in.orders.0.customer'
  });
  const otherNode = createNode({ id: 'other-root', type: 'DATA', description: 'other = Data()' });
  const request = vi
    .fn()
    .mockResolvedValueOnce({ historyNodes: [lazyNode] })
    .mockResolvedValueOnce({
      historyNodes: [
        createNode({
          ...lazyNode,
          children: [createNode({ id: 'loaded-child', type: 'DATA', description: 'name = Luke' })]
        })
      ]
    })
    .mockResolvedValueOnce({ historyNodes: [otherNode] })
    .mockResolvedValueOnce({ historyNodes: [lazyNode] });

  const { rerenderHistory } = renderHistory(request, { pid: 'pid-a' });

  await screen.findByText('customer = Data()');
  await userEvent.click(screen.getByLabelText('Expand row'));
  await screen.findByText('name = Luke');

  rerenderHistory('pid-b');
  await screen.findByText('other = Data()');

  rerenderHistory('pid-a');
  await screen.findByText('name = Luke');

  expect(request.mock.calls.filter(([action]) => RequestHistoryAction.is(action) && action.lazyDataRequest !== undefined)).toHaveLength(1);
});

test('shows lazy-load failure indicator and retries on the next expand', async () => {
  const lazyNode = createNode({
    id: 'lazy-root',
    type: 'DATA',
    description: 'customer = Data()',
    expandable: true,
    requestId: 'req-1',
    executionTime: '2026-03-11T10:00:00.000Z',
    dataPath: 'in.orders.0.customer'
  });
  const request = vi
    .fn()
    .mockResolvedValueOnce({ historyNodes: [lazyNode] })
    .mockRejectedValueOnce(new Error('lazy failed'))
    .mockResolvedValueOnce({
      historyNodes: [
        createNode({
          ...lazyNode,
          children: [createNode({ id: 'loaded-child', type: 'DATA', description: 'name = Luke' })]
        })
      ]
    });

  renderHistory(request);
  await screen.findByText('customer = Data()');

  await userEvent.click(screen.getByLabelText('Expand row'));
  await screen.findByRole('status', { name: 'Failed to load data' });

  await userEvent.click(screen.getByLabelText('Expand row'));
  await screen.findByText('name = Luke');
  expect(request).toHaveBeenCalledTimes(3);
});

test('refresh clears cached lazy subtree queries for the current element', async () => {
  const lazyNode = createNode({
    id: 'lazy-root',
    type: 'DATA',
    description: 'customer = Data()',
    expandable: true,
    requestId: 'req-1',
    executionTime: '2026-03-11T10:00:00.000Z',
    dataPath: 'in.orders.0.customer'
  });
  const request = vi
    .fn()
    .mockResolvedValueOnce({ historyNodes: [lazyNode] })
    .mockResolvedValueOnce({
      historyNodes: [
        createNode({
          ...lazyNode,
          children: [createNode({ id: 'loaded-child', type: 'DATA', description: 'name = Luke' })]
        })
      ]
    })
    .mockResolvedValueOnce({ historyNodes: [lazyNode] });

  const { queryClient } = renderHistory(request);

  await screen.findByText('customer = Data()');
  await userEvent.click(screen.getByLabelText('Expand row'));
  await screen.findByText('name = Luke');

  expect(queryClient.getQueriesData({ queryKey: ['process', 'history', 'lazy', 'app', 'pmv', 'pid'], exact: false })).toHaveLength(1);

  await userEvent.click(screen.getByLabelText('Refresh'));

  await waitFor(() => expect(request).toHaveBeenCalledTimes(3));
  await waitFor(() =>
    expect(queryClient.getQueriesData({ queryKey: ['process', 'history', 'lazy', 'app', 'pmv', 'pid'], exact: false })).toHaveLength(0)
  );
});
