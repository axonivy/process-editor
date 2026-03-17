import { describe, expect, test, vi } from 'vitest';
import { IvyScriptLanguage } from './ivy-script-language';
import type { MonacoApi, monaco } from './monaco-modules';

const createModel = (text: string): monaco.editor.ITextModel => {
  const lines = text.split(/\r?\n/);
  return {
    getLineCount: () => lines.length,
    getLineContent: (lineNumber: number) => lines[lineNumber - 1] ?? ''
  } as monaco.editor.ITextModel;
};

const createMonacoMock = () => {
  let provider: monaco.languages.FoldingRangeProvider | undefined;

  const monacoApi = {
    languages: {
      FoldingRangeKind: {
        Imports: 'imports',
        Region: 'region'
      },
      getLanguages: vi.fn(() => []),
      register: vi.fn(),
      setLanguageConfiguration: vi.fn(),
      setMonarchTokensProvider: vi.fn(),
      registerFoldingRangeProvider: vi.fn((_languageId, foldingProvider) => {
        provider = foldingProvider;
        return { dispose: vi.fn() };
      })
    }
  } as unknown as MonacoApi;

  return {
    monacoApi,
    getProvider: () => provider
  };
};

describe('ivy script folding provider', () => {
  test('adds import folding and preserves block folding', async () => {
    const monacoMock = createMonacoMock();

    await IvyScriptLanguage.install(monacoMock.monacoApi);

    const provider = monacoMock.getProvider();
    expect(provider).toBeDefined();

    const ranges = provider?.provideFoldingRanges(
      createModel(`import a.b.C;

import x.y.Z;

if (true) {
  call();
}`),
      {} as monaco.languages.FoldingContext,
      {} as monaco.CancellationToken
    );

    expect(ranges).toEqual([
      { start: 5, end: 7 },
      { start: 1, end: 3, kind: 'imports' }
    ]);
  });

  test('ignores braces inside line comments, block comments, strings and char literals', async () => {
    const monacoMock = createMonacoMock();

    await IvyScriptLanguage.install(monacoMock.monacoApi);

    const provider = monacoMock.getProvider();
    expect(provider).toBeDefined();

    const ranges = provider?.provideFoldingRanges(
      createModel(`if (true) {
  // }
  /* {
   * }
   */
  String text = "{";
  char value = '}';
  run();
}`),
      {} as monaco.languages.FoldingContext,
      {} as monaco.CancellationToken
    );

    expect(ranges).toEqual([{ start: 1, end: 9 }]);
  });

  test('keeps marker region folding', async () => {
    const monacoMock = createMonacoMock();

    await IvyScriptLanguage.install(monacoMock.monacoApi);

    const provider = monacoMock.getProvider();
    expect(provider).toBeDefined();

    const ranges = provider?.provideFoldingRanges(
      createModel(`// #region test
if (true) {
  run();
}
// #endregion`),
      {} as monaco.languages.FoldingContext,
      {} as monaco.CancellationToken
    );

    expect(ranges).toEqual([
      { start: 2, end: 4 },
      { start: 1, end: 5, kind: 'region' }
    ]);
  });
});
