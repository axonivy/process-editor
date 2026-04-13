import type { ReactNode } from 'react';
import { createContext, use, useState } from 'react';

type OpenApiContext = {
  openApi: boolean;
  setOpenApi: React.Dispatch<React.SetStateAction<boolean>>;
};

const OpenApiContext = createContext<OpenApiContext>({ openApi: false, setOpenApi: () => {} });
export const useOpenApi = () => use(OpenApiContext);

export const OpenApiContextProvider = ({ children }: { children: ReactNode }) => {
  const [openApi, setOpenApi] = useState(true);

  return <OpenApiContext value={{ openApi, setOpenApi }}>{children}</OpenApiContext>;
};
