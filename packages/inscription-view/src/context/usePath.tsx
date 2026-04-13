import type { SchemaKeys, SchemaPath } from '@axonivy/process-editor-inscription-protocol';
import type { ReactNode } from 'react';
import { createContext, use } from 'react';

const PathContext = createContext<SchemaPath | SchemaKeys | ''>('');

export const PathProvider = ({ path, children }: { path: SchemaKeys | number; children: ReactNode }) => {
  const fullPath = useFullPath([path]);
  return <PathContext value={fullPath}>{children}</PathContext>;
};

export const usePath = () => use(PathContext);

export const useFullPath = (paths?: Array<SchemaKeys | number>) => {
  const parentPath = use(PathContext);
  return mergePaths(parentPath, paths ?? []);
};

export const mergePaths = (parentPath: string, subPaths: Array<string | number>) => mergeSchemaPaths(parentPath, subPaths) as SchemaPath;

const mergeSchemaPaths = (parentPath: string, subPaths: Array<string | number>): string => {
  if (parentPath.length === 0) {
    return pathToString(subPaths);
  }
  if (subPaths.length === 0) {
    return parentPath;
  }
  return pathToString([parentPath, ...subPaths]);
};

const pathToString = (paths: Array<string | number>): string => {
  return paths
    .map(path => (Number.isInteger(path) ? `[${path}]` : path) as string)
    .filter(path => path.length > 0)
    .join('.');
};
