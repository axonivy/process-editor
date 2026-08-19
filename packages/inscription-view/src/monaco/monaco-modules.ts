import { LazyLoader } from '@axonivy/process-editor-inscription-core';

import type * as monaco from 'monaco-editor';
export type * as monaco from 'monaco-editor'; // re-export for easier maintenance
export type MonacoApi = typeof monaco;

export namespace MonacoModule {
  export const Api = new LazyLoader(() => import('monaco-editor'));
}

export namespace MonacoLanguagePack {
  export async function loadLocale(locale: string = 'en'): Promise<void> {
    if (locale !== 'en') {
      console.warn(`Monaco language pack '${locale}' is unavailable in Monaco Editor 0.56.0; using English.`);
    }
  }
}

// copied from monaco-vscode-api so we can use it without loading the module
export enum LogLevel {
  Off = 0,
  Trace = 1,
  Debug = 2,
  Info = 3,
  Warning = 4,
  Error = 5
}
