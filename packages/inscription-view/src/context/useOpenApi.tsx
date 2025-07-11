import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';

type OpenApiContext = {
  openApi: boolean;
  setOpenApi: React.Dispatch<React.SetStateAction<boolean>>;
};

const OpenApiContextInstance = createContext<OpenApiContext>({ openApi: false, setOpenApi: () => {} });
export const useOpenApi = () => useContext(OpenApiContextInstance);

export const OpenApiContextProvider = ({ children }: { children: ReactNode }) => {
  const [openApi, setOpenApi] = useState(true);

  return <OpenApiContextInstance.Provider value={{ openApi, setOpenApi }}>{children}</OpenApiContextInstance.Provider>;
};
