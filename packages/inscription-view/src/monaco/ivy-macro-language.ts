import { createIvyScriptLanguage } from './ivy-script-language';
import { MonacoLanguageUtil } from './monaco-language-util';
import type { MonacoApi, monaco } from './monaco-modules';
import { MonacoUtil } from './monaco-util';

export namespace IvyMacroLanguage {
  export const Language: monaco.languages.ILanguageExtensionPoint = {
    id: 'ivyMacro',
    extensions: ['.ivyMacro', '.ivyMacro'],
    aliases: []
  };

  export async function isInstalled(monaco?: MonacoApi): Promise<boolean> {
    return MonacoLanguageUtil.isInstalled(Language.id, monaco);
  }

  export async function install(monacoApi?: MonacoApi): Promise<void> {
    const monaco = await MonacoUtil.resolve(monacoApi);
    if (await isInstalled(monaco)) {
      return;
    }
    monaco.languages.register(Language);
    const { language: javaLanguage } = await import('monaco-editor/languages/definitions/java/java');
    const ivyScriptLanguage = createIvyScriptLanguage(javaLanguage);
    monaco.languages.setLanguageConfiguration(Language.id, ivyMacroConf);
    monaco.languages.setMonarchTokensProvider(Language.id, createIvyMacroLanguage(ivyScriptLanguage));
  }
}

export const createIvyMacroLanguage = (ivyScriptLanguage: monaco.languages.IMonarchLanguage): monaco.languages.IMonarchLanguage => ({
  ...ivyScriptLanguage,
  tokenizer: {
    ...ivyScriptLanguage.tokenizer,
    root: [
      [/[^<]+/, ''],
      [/<%=/, 'tag', '@ivyExpression'],
      [/</, '']
    ],
    ivyExpression: [
      [/%>/, 'tag', '@pop'],
      { include: '@ivyScriptRoot' }
    ],
    ivyScriptRoot: [...(ivyScriptLanguage.tokenizer.root ?? [])]
  }
});

export const ivyMacroConf: monaco.languages.LanguageConfiguration = {
  wordPattern: /(-?\d*\.\d\w*)|([^`~!#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]+)/g,
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/']
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '<%', close: '%>' }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '<', close: '>' }
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*//\\s*(?:(?:#?region\\b)|(?:<editor-fold\\b))'),
      end: new RegExp('^\\s*//\\s*(?:(?:#?endregion\\b)|(?:</editor-fold>))')
    }
  }
};
