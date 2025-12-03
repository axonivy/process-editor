import type { QueryClient } from '@tanstack/react-query';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

export const QueryProvider = ({ client, children }: { client: QueryClient; children: ReactNode }) => (
  <QueryClientProvider client={client}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} buttonPosition={'bottom-left'} />
  </QueryClientProvider>
);
