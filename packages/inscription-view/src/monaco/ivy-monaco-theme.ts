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
          'editor.background': '#333333'
        },
        inherit: true,
        rules: []
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
      rules: []
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
