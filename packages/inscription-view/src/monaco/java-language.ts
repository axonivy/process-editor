import { MonacoLanguageUtil } from './monaco-language-util';
import type { MonacoApi, monaco } from './monaco-modules';
import { MonacoUtil } from './monaco-util';

const installedApis = new WeakSet<object>();

export const withJavaSyntaxHighlighting = (language: monaco.languages.IMonarchLanguage): monaco.languages.IMonarchLanguage => ({
  ...language,
  tokenizer: {
    ...language.tokenizer,
    root: [
      // Match the TextMate scopes used by Java themes, and never split CamelCase names such as ITask.
      [/[A-Z_$][A-Z0-9_$]*_[A-Z0-9_$]+(?![a-zA-Z0-9_$])/, 'variable.other.constant.java'],
      [/I[A-Z][\w$]*/, { cases: { '@keywords': 'keyword.$0', '@default': 'entity.name.type.java' } }],
      [/[A-Z_$][\w$]*/, { cases: { '@keywords': 'keyword.$0', '@default': 'entity.name.type.java' } }],
      [/[a-zA-Z_$][\w$]*(?=\s*\()/, { cases: { '@keywords': 'keyword.$0', '@default': 'entity.name.function.java' } }],
      [/[a-zA-Z_$][\w$]*(?=\s*=)/, { cases: { '@keywords': 'keyword.$0', '@default': 'variable.other.object.java' } }],
      [/[a-zA-Z_$][\w$]*(?=\s*\.)/, { cases: { '@keywords': 'keyword.$0', '@default': 'variable.other.object.java' } }],
      ...(language.tokenizer.root ?? [])
    ]
  }
});

export namespace JavaLanguage {
  export const Language = { id: 'java' };

  export async function install(monacoApi?: MonacoApi): Promise<void> {
    const monaco = await MonacoUtil.resolve(monacoApi);
    if (installedApis.has(monaco)) {
      return;
    }

    if (!(await MonacoLanguageUtil.isInstalled(Language.id, monaco))) {
      // Register Monaco's built-in Java language lazily so it doesn't inflate the initial bundle.
      await import('monaco-editor/languages/definitions/java/register');
    }

    const { conf, language } = await import('monaco-editor/languages/definitions/java/java');
    monaco.languages.setLanguageConfiguration(Language.id, conf);
    monaco.languages.setMonarchTokensProvider(Language.id, withJavaSyntaxHighlighting(language));
    installedApis.add(monaco);
  }
}
