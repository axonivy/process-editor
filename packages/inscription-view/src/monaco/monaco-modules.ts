import { LazyLoader } from '@axonivy/process-editor-inscription-core';

import type * as monaco from '@codingame/monaco-vscode-editor-api';
import type * as vscode from 'vscode';

export type * as monaco from '@codingame/monaco-vscode-editor-api'; // re-export for easier maintenance
export type MonacoApi = typeof monaco;

export type * as vscode from 'vscode'; // re-export for easier maintenance
export type VscodeApi = typeof vscode;

export namespace MonacoLanguageClient {
  export const Common = new LazyLoader(() => import('monaco-languageclient/common'));
  export const Debugger = new LazyLoader(() => import('monaco-languageclient/debugger'));
  export const EditorApp = new LazyLoader(() => import('monaco-languageclient/editorApp'));
  export const Fs = new LazyLoader(() => import('monaco-languageclient/fs'));
  export const LanguageClient = new LazyLoader(() => import('monaco-languageclient/lcwrapper'));
  export const Locale = new LazyLoader(() => import('monaco-languageclient/vscodeApiLocales'));
  export const Vscode = new LazyLoader(() => import('monaco-languageclient/vscodeApiWrapper'));
  export const WorkerFactory = new LazyLoader(() => import('monaco-languageclient/workerFactory'));
}

export namespace CodinGame {
  export const MonacoVscodeApi = new LazyLoader(() => import('@codingame/monaco-vscode-api'));
  export const MonacoVscodeExtensionsApi = new LazyLoader(() => import('@codingame/monaco-vscode-extension-api'));
  export const MonacoVscodeEditorApi = new LazyLoader(() => import('@codingame/monaco-vscode-editor-api'));

  export const WorkbenchService = new LazyLoader(() => import('@codingame/monaco-vscode-workbench-service-override'));
  type WorkbenchType = (typeof import('@codingame/monaco-vscode-workbench-service-override'))['default'];
  export async function workbenchOverride(
    options?: Parameters<WorkbenchType>[0],
    _webviewIframeAlternateDomains?: Parameters<WorkbenchType>[1]
  ): Promise<monaco.editor.IEditorOverrideServices> {
    const module = await CodinGame.WorkbenchService.load();
    return module.default(options, _webviewIframeAlternateDomains);
  }

  export const KeybindingsService = new LazyLoader(() => import('@codingame/monaco-vscode-keybindings-service-override'));
  type KeybindingsType = (typeof import('@codingame/monaco-vscode-keybindings-service-override'))['default'];
  export async function keybindingsOverride(props?: Parameters<KeybindingsType>[0]): Promise<monaco.editor.IEditorOverrideServices> {
    const module = await CodinGame.KeybindingsService.load();
    return module.default(props);
  }

  export const ConfigurationService = new LazyLoader(() => import('@codingame/monaco-vscode-configuration-service-override'));
  export async function configurationOverride(): Promise<monaco.editor.IEditorOverrideServices> {
    const module = await CodinGame.ConfigurationService.load();
    return module.default();
  }

  export const LanguagesService = new LazyLoader(() => import('@codingame/monaco-vscode-languages-service-override'));
  export async function languagesOverride(): Promise<monaco.editor.IEditorOverrideServices> {
    const module = await LanguagesService.load();
    return module.default();
  }

  export const LocalizationService = new LazyLoader(() => import('@codingame/monaco-vscode-localization-service-override'));
  type LocalizationType = (typeof import('@codingame/monaco-vscode-localization-service-override'))['default'];
  export async function localizationOverride(options?: Parameters<LocalizationType>[0]): Promise<monaco.editor.IEditorOverrideServices> {
    const module = await LocalizationService.load();
    const actualOptions = options ?? (await MonacoLanguageClient.Locale.load()).createDefaultLocaleConfiguration();
    return module.default(actualOptions);
  }
}

export namespace MonacoLanguagePack {
  export const German = new LazyLoader(() => import('@codingame/monaco-vscode-language-pack-de'));
  export const French = new LazyLoader(() => import('@codingame/monaco-vscode-language-pack-fr'));
  export const Japanese = new LazyLoader(() => import('@codingame/monaco-vscode-language-pack-ja'));

  export async function loadLocale(locale: string = 'en'): Promise<void> {
    if (locale === 'en') {
      // English is the default language, no need to load anything
      return;
    }
    switch (locale) {
      case 'de':
        await MonacoLanguagePack.German.load();
        break;
      case 'fr':
        await MonacoLanguagePack.French.load();
        break;
      case 'ja':
        await MonacoLanguagePack.Japanese.load();
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
