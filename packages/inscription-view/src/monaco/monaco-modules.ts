import { LazyLoader } from '@axonivy/process-editor-inscription-core';

import type * as monaco from 'monaco-editor';
export type * as monaco from 'monaco-editor'; // re-export for easier maintenance
export type MonacoApi = typeof monaco;

export namespace MonacoModule {
  export const Api = new LazyLoader(() => import('monaco-editor'));
}

export namespace MonacoLanguagePack {
  export const Czech = new LazyLoader(() => import('monaco-editor/esm/nls.messages.cs.js'));
  export const German = new LazyLoader(() => import('monaco-editor/esm/nls.messages.de.js'));
  export const Spanish = new LazyLoader(() => import('monaco-editor/esm/nls.messages.es.js'));
  export const French = new LazyLoader(() => import('monaco-editor/esm/nls.messages.fr.js'));
  export const Italian = new LazyLoader(() => import('monaco-editor/esm/nls.messages.it.js'));
  export const Japanese = new LazyLoader(() => import('monaco-editor/esm/nls.messages.ja.js'));
  export const Korean = new LazyLoader(() => import('monaco-editor/esm/nls.messages.ko.js'));
  export const Polish = new LazyLoader(() => import('monaco-editor/esm/nls.messages.pl.js'));
  export const PortugueseBrazil = new LazyLoader(() => import('monaco-editor/esm/nls.messages.pt-br.js'));
  export const Russian = new LazyLoader(() => import('monaco-editor/esm/nls.messages.ru.js'));
  export const Turkish = new LazyLoader(() => import('monaco-editor/esm/nls.messages.tr.js'));
  export const ChineseSimplified = new LazyLoader(() => import('monaco-editor/esm/nls.messages.zh-cn.js'));
  export const ChineseTraditional = new LazyLoader(() => import('monaco-editor/esm/nls.messages.zh-tw.js'));

  export async function loadLocale(locale: string = 'en'): Promise<void> {
    if (locale === 'en') {
      // English is the default language, no need to load anything
      return;
    }
    switch (locale) {
      case 'cs':
        await MonacoLanguagePack.Czech.load();
        break;
      case 'de':
        await MonacoLanguagePack.German.load();
        break;
      case 'es':
        await MonacoLanguagePack.Spanish.load();
        break;
      case 'fr':
        await MonacoLanguagePack.French.load();
        break;
      case 'it':
        await MonacoLanguagePack.Italian.load();
        break;
      case 'ja':
        await MonacoLanguagePack.Japanese.load();
        break;
      case 'ko':
        await MonacoLanguagePack.Korean.load();
        break;
      case 'pl':
        await MonacoLanguagePack.Polish.load();
        break;
      case 'pt-br':
        await MonacoLanguagePack.PortugueseBrazil.load();
        break;
      case 'ru':
        await MonacoLanguagePack.Russian.load();
        break;
      case 'tr':
        await MonacoLanguagePack.Turkish.load();
        break;
      case 'zh-cn':
        await MonacoLanguagePack.ChineseSimplified.load();
        break;
      case 'zh-tw':
        await MonacoLanguagePack.ChineseTraditional.load();
        break;
      default:
        console.error(`No locale available for language '${locale}'.`);
        // no locale available
        break;
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
