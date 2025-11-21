import { ConsoleTimer, Deferred } from '@axonivy/process-editor-inscription-core';

import type { WorkerLoader } from 'monaco-languageclient/workerFactory';
import {
  CodinGame,
  LogLevel,
  MonacoLanguageClient,
  MonacoLanguagePack,
  type MonacoApi,
  type VscodeApi,
  type monaco
} from './monaco-modules';

export type LazyIEditorOverrideServices = () => Promise<monaco.editor.IEditorOverrideServices>;

export type WorkerLabel =
  | 'TextEditorWorker'
  | 'TextMateWorker'
  | 'OutputLinkDetectionWorker'
  | 'LanguageDetectionWorker'
  | 'NotebookEditorWorker'
  | 'LocalFileSearchWorker'
  | (string & {});

export interface MonacoInitParams {
  locale?: string;
  logLevel?: LogLevel;
  serviceOverrides?: LazyIEditorOverrideServices[];
  workerLoaders?: Partial<Record<WorkerLabel, WorkerLoader>>;
}

export namespace MonacoUtil {
  const _monacoInstance = new Deferred<MonacoApi>();
  export async function monaco(): Promise<MonacoApi> {
    return _monacoInstance.promise;
  }

  export async function resolve(known?: MonacoApi): Promise<MonacoApi> {
    return known ?? monaco();
  }

  let _initialized = false;
  export function initialized(): boolean {
    return _initialized;
  }

  export async function initialize({
    locale,
    logLevel = LogLevel.Warning,
    serviceOverrides = [],
    workerLoaders = {}
  }: MonacoInitParams = {}): Promise<MonacoApi> {
    if (initialized()) {
      return monaco();
    }
    _initialized = true;

    const timer = new ConsoleTimer(logLevel === LogLevel.Debug, 'Setup Monaco API').start();
    if (locale) {
      timer.step(`Load language '${locale}'...`);
      await MonacoLanguagePack.loadLocale(locale);
    }

    timer.step('Load necessary modules...');
    const lcMonacoVscode = await MonacoLanguageClient.Vscode.load();
    const lcWorkerFactory = await MonacoLanguageClient.WorkerFactory.load();

    timer.step('Load service overrides...');
    const loadedServiceOverrides = await Promise.all(serviceOverrides.map(serviceOverride => serviceOverride()));
    const mergedServiceOverrides = loadedServiceOverrides.reduce((acc, curr) => ({ ...acc, ...curr }), {});

    timer.step('Initialize Monaco Vscode API...');
    const apiWrapper = new lcMonacoVscode.MonacoVscodeApiWrapper({
      $type: 'classic',
      viewsConfig: { $type: 'EditorService' },
      logLevel: logLevel,
      serviceOverrides: mergedServiceOverrides,
      userConfiguration: {},
      monacoWorkerFactory: logger =>
        lcWorkerFactory.useWorkerFactory({
          workerLoaders: { ...lcWorkerFactory.defineDefaultWorkerLoaders(), ...workerLoaders },
          logger
        }),
      advanced: { enforceSemanticHighlighting: true },
      workspaceConfig: {
        productConfiguration: {
          applicationName: 'Axon Ivy Editor',
          builtInExtensions: [],
          commit: undefined
        }
      }
    });

    await apiWrapper.start({ caller: 'MonacoUtil', performServiceConsistencyChecks: true }); // after this monaco is available globally

    timer.step('Load initialized Monaco Vscode API...');
    const _monaco = await CodinGame.MonacoVscodeEditorApi.load();
    timer.end();
    _monacoInstance.resolve(_monaco);
    return _monacoInstance.promise;
  }

  export async function vscode(): Promise<VscodeApi> {
    return CodinGame.MonacoVscodeExtensionsApi.load();
  }

  export async function vscodeServicesReady(): Promise<void> {
    const vscodeApi = await CodinGame.MonacoVscodeApi.load();
    const serviceReadyDeferred = new Deferred<void>();
    vscodeApi.withReadyServices(() => {
      serviceReadyDeferred.resolve();
      return {
        dispose: () => {
          /* no op */
        }
      };
    });
    return serviceReadyDeferred.promise;
  }
}
