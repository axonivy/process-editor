import type { InscriptionClient } from '@axonivy/process-editor-inscription-protocol';
import type { ReactNode } from 'react';
import { createContext, use } from 'react';

export interface ClientContext {
  client: InscriptionClient;
}

/** We always use a provider so default can be undefined */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultClientContext: any = undefined;

const ClientContext = createContext<ClientContext>(defaultClientContext);
export const useClient = (): InscriptionClient => {
  const { client } = use(ClientContext);
  return client;
};

export const ClientContextProvider = ({ client, children }: { client: InscriptionClient; children: ReactNode }) => {
  return <ClientContext value={{ client }}>{children}</ClientContext>;
};
