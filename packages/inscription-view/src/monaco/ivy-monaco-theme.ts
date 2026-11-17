import type { MonacoApi, monaco } from './monaco-modules';
import { MonacoUtil } from './monaco-util';

export type IvyMonacoTheme = 'light' | 'dark';

export namespace IvyMonacoTheme {
  export const DEFAULT_THEME_NAME = 'axon-input';

  export function themeData(theme?: IvyMonacoTheme): monaco.editor.IStandaloneThemeData {
    if (theme === 'dark') {
      return {
        base: 'vs-dark',
        colors: {
          'editor.foreground': '#FFFFFF',
          'editorCursor.foreground': '#FFFFFF',
          'editor.background': '#33333300'
        },
        inherit: true,
        rules: [
          { token: 'entity.name.type.java', foreground: '4EC9B0' },
          { token: 'entity.name.function.java', foreground: 'DCDCAA' },
          { token: 'variable.other.object.java', foreground: '9CDCFE' },
          { token: 'variable.other.constant.java', foreground: '4FC1FF' }
        ]
      };
    }
    return {
      base: 'vs',
      colors: {
        'editor.foreground': '#202020',
        'editorCursor.foreground': '#202020',
        'editor.background': '#fafafa'
      },
      inherit: true,
      rules: [
        { token: 'entity.name.type.java', foreground: '267F99' },
        { token: 'entity.name.function.java', foreground: '795E26' },
        { token: 'variable.other.object.java', foreground: '001080' },
        { token: 'variable.other.constant.java', foreground: '0070C1' }
      ]
    };
  }

  export type ThemeChangeEvent = CustomEvent<IvyMonacoTheme>;
  class ThemeChangeEventImpl extends CustomEvent<IvyMonacoTheme> {
    constructor(theme: IvyMonacoTheme) {
      super('monaco-theme', { detail: theme });
    }
  }

  const _emitter = new EventTarget();
  export type ThemeChangeListener = (theme: IvyMonacoTheme) => void;
  export const onDidSetTheme: (listener: ThemeChangeListener) => void = listener =>
    _emitter.addEventListener('monaco-theme', evt => listener((evt as ThemeChangeEvent).detail));
  export async function setTheme(theme: IvyMonacoTheme, monacoApi?: MonacoApi): Promise<void> {
    const monaco = await MonacoUtil.resolve(monacoApi);
    // defineTheme is only available on the standalone theme service but not the workbench theme service you get when using 'extended' editor setup
    monaco.editor.defineTheme?.(DEFAULT_THEME_NAME, themeData(theme));
    monaco.editor.setTheme(DEFAULT_THEME_NAME);
    _emitter.dispatchEvent(new ThemeChangeEventImpl(theme));
  }
}
