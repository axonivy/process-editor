import type { LanguageClientConfig, LanguageClientManager, LanguageClientWrapper } from 'monaco-languageclient/lcwrapper';
import { MonacoLanguageClient, type MonacoApi } from './monaco-modules';
import { MonacoUtil } from './monaco-util';

export namespace MonacoLanguageUtil {
  let languageClientManager: LanguageClientManager | undefined;
  export async function setLanguageClient(config: LanguageClientConfig): Promise<LanguageClientWrapper> {
    await MonacoUtil.monaco();
    await MonacoUtil.vscodeServicesReady();
    if (languageClientManager === undefined) {
      const lcClient = await MonacoLanguageClient.LanguageClient.load();
      languageClientManager = new lcClient.LanguageClientManager();
    }
    languageClientManager.setConfig(config);
    const languageClient = languageClientManager.getLanguageClientWrapper(config.languageId);
    if (!languageClient) {
      throw new Error(`LanguageClientWrapper for languageId "${config.languageId}" was not found after adding the config.`);
    }
    return languageClient;
  }

  export async function isInstalled(languageId: string, monacoApi?: MonacoApi): Promise<boolean> {
    const monaco = await MonacoUtil.resolve(monacoApi);
    const languages = monaco.languages.getLanguages();
    return languages.some(lang => lang.id === languageId);
  }
}
