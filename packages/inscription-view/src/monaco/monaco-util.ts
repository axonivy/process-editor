import { ConsoleTimer, Deferred } from '@axonivy/process-editor-inscription-core';

import { LogLevel, MonacoLanguagePack, MonacoModule, type MonacoApi } from './monaco-modules';

// Must be defined before Monaco tries to access it, but getWorker itself is lazy -
// the Worker is only created when Monaco actually needs one (e.g., for color detection)
self.MonacoEnvironment = {
  getWorker() {
    return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' });
  }
};

export interface MonacoInitParams {
  locale?: string;
  logLevel?: LogLevel;
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

  export async function initialize({ locale, logLevel = LogLevel.Warning }: MonacoInitParams = {}): Promise<MonacoApi> {
    if (initialized()) {
      return monaco();
    }
    _initialized = true;

    const timer = new ConsoleTimer(logLevel === LogLevel.Debug, 'Setup Monaco API').start();
    if (locale) {
      timer.step(`Load language '${locale}'...`);
      await MonacoLanguagePack.loadLocale(locale);
    }

    timer.step('Load initialized Monaco Vscode API...');
    const _monaco = await MonacoModule.Api.load();
    timer.end();
    _monacoInstance.resolve(_monaco);
    return _monacoInstance.promise;
  }
}
