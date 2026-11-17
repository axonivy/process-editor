import { beforeEach, describe, expect, test, vi } from 'vitest';
import type { MonacoApi, monaco } from './monaco-modules';

const mocks = vi.hoisted(() => ({
  registerJava: vi.fn(),
  loadJava: vi.fn(),
  javaLanguage: {
    conf: {},
    language: {
      keywords: ['if'],
      tokenizer: { root: [['[a-zA-Z_$][\\w$]*', 'identifier']] }
    }
  }
}));

vi.mock('monaco-editor/languages/definitions/java/register', () => {
  mocks.registerJava();
  return {};
});
vi.mock('monaco-editor/languages/definitions/java/java', () => {
  mocks.loadJava();
  return mocks.javaLanguage;
});

import { JavaLanguage } from './java-language';

const createMonacoMock = (languages: Array<{ id: string }> = []) => {
  const monacoApi = {
    languages: {
      getLanguages: vi.fn(() => languages),
      setLanguageConfiguration: vi.fn(),
      setMonarchTokensProvider: vi.fn()
    }
  } as unknown as MonacoApi;
  return { monacoApi, languages: monacoApi.languages };
};

describe('JavaLanguage', () => {
  beforeEach(() => {
    mocks.registerJava.mockClear();
    mocks.loadJava.mockClear();
  });

  test('registers Java and adds method, type, and constant tokens', async () => {
    const { monacoApi, languages } = createMonacoMock();

    await JavaLanguage.install(monacoApi);

    expect(mocks.registerJava).toHaveBeenCalledOnce();
    expect(languages.setLanguageConfiguration).toHaveBeenCalledWith(JavaLanguage.Language.id, mocks.javaLanguage.conf);
    const [languageId, language] = vi.mocked(languages.setMonarchTokensProvider).mock.calls[0] ?? [];
    expect(languageId).toBe(JavaLanguage.Language.id);
    const root = (language as monaco.languages.IMonarchLanguage).tokenizer.root ?? [];
    expect(root[0]).toEqual([/[A-Z_$][A-Z0-9_$]*_[A-Z0-9_$]+(?![a-zA-Z0-9_$])/, 'variable.other.constant.java']);
    expect(root[1]).toEqual([/I[A-Z][\w$]*/, { cases: { '@keywords': 'keyword.$0', '@default': 'entity.name.type.java' } }]);
    expect(root[2]).toEqual([/[A-Z_$][\w$]*/, { cases: { '@keywords': 'keyword.$0', '@default': 'entity.name.type.java' } }]);
    expect(root[3]).toEqual([/[a-zA-Z_$][\w$]*(?=\s*\()/, { cases: { '@keywords': 'keyword.$0', '@default': 'entity.name.function.java' } }]);
  });

  test('enhances Java highlighting when the language is already registered', async () => {
    const { monacoApi, languages } = createMonacoMock([{ id: JavaLanguage.Language.id }]);

    await JavaLanguage.install(monacoApi);

    expect(mocks.registerJava).not.toHaveBeenCalled();
    expect(languages.setMonarchTokensProvider).toHaveBeenCalledOnce();
  });

  test('installs only once per Monaco API instance', async () => {
    const { monacoApi, languages } = createMonacoMock();

    await JavaLanguage.install(monacoApi);
    await JavaLanguage.install(monacoApi);

    expect(languages.setMonarchTokensProvider).toHaveBeenCalledOnce();
  });
});
