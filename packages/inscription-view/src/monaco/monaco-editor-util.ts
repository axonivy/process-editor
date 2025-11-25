import { ConsoleTimer } from '@axonivy/process-editor-inscription-core';
import React from 'react';
import { focusAdjacentTabIndexMonaco } from '../utils/focus';
import { IvyMacroLanguage } from './ivy-macro-language';
import { IvyMonacoTheme } from './ivy-monaco-theme';
import { IvyScriptLanguage } from './ivy-script-language';
import { MonacoEditorReactComp } from './monaco-editor-react';
import type { MonacoApi, monaco } from './monaco-modules';
import { MonacoUtil, type MonacoInitParams } from './monaco-util';

export const MONACO_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  glyphMargin: false,
  lineNumbers: 'off',
  minimap: { enabled: false },
  overviewRulerBorder: false,
  overviewRulerLanes: 1,
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  folding: false,
  renderLineHighlight: 'none',
  fontFamily:
    "'Droid Sans Mono', 'monospace', monospace, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: 12,
  tabSize: 2,
  renderWhitespace: 'all',
  fixedOverflowWidgets: true,
  scrollbar: {
    useShadows: false
  }
};

export const MAXIMIZED_MONACO_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  ...MONACO_OPTIONS,
  lineNumbers: 'on',
  folding: true,
  showFoldingControls: 'always'
};

export const SINGLE_LINE_MONACO_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  ...MONACO_OPTIONS,
  overviewRulerLanes: 0,
  overviewRulerBorder: false,
  hideCursorInOverviewRuler: true,
  scrollBeyondLastColumn: 0,
  scrollbar: {
    horizontal: 'hidden',
    vertical: 'hidden',
    alwaysConsumeMouseWheel: false
  },
  find: {
    addExtraSpaceOnTop: false,
    autoFindInSelection: 'never',
    seedSearchStringFromSelection: 'never'
  },
  links: false,
  renderLineHighlight: 'none',
  contextmenu: false
};

export type MonacoEditorConfiguration = MonacoInitParams & { theme?: IvyMonacoTheme };

export namespace MonacoEditorUtil {
  export const keyActionEscShiftTab = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.addCommand(KeyCode.Escape, () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((editor as any)._contentWidgets['editor.widget.suggestWidget']?.widget._widget._state === 3) {
        editor.trigger(undefined, 'hideSuggestWidget', undefined);
      } else {
        focusAdjacentTabIndexMonaco('next');
      }
    });
    editor.addCommand(KeyCode.Shift | KeyCode.Tab, () => {
      if (editor.hasTextFocus() && document.activeElement instanceof HTMLElement) {
        focusAdjacentTabIndexMonaco('previous');
      }
    });
  };

  export async function configureMonaco({ theme = 'light', ...initConfig }: MonacoEditorConfiguration): Promise<MonacoApi> {
    if (MonacoUtil.initialized()) {
      console.warn('Monaco already initialized, skipping configuration');
      return MonacoUtil.monaco();
    }
    const monaco = await MonacoUtil.initialize(initConfig);
    await Promise.all([IvyScriptLanguage.install(monaco), IvyMacroLanguage.install(monaco), IvyMonacoTheme.setTheme(theme, monaco)]);
    return monaco;
  }

  export async function setTheme(theme: IvyMonacoTheme): Promise<void> {
    return IvyMonacoTheme.setTheme(theme);
  }

  export const onDidSetTheme = IvyMonacoTheme.onDidSetTheme;

  // Avoid loading Monaco, so we replicate the necessary Key codes here since they are very stable.
  export enum KeyCode {
    Tab = 2,
    Enter = 3,
    Escape = 9,
    F2 = 60,
    UpArrow = 16,
    DownArrow = 18,
    Shift = 1024
  }
}

// We currently have an issue with the Typefox React editor where our in-line editors get disposed automatically in Strict Mode
// https://github.com/TypeFox/monaco-languageclient/issues/994
//
// export const TypefoxMonacoEditorReact = new LazyLoader(() => import('@typefox/monaco-editor-react'));
// export const MonacoEditor = React.lazy(async () => {
//   const timer = new ConsoleTimer(true, 'Initialize Monaco Editor Component (only necessary once)').start();
//   timer.step('Wait for Monaco API...');
//   await MonacoUtil.monaco();
//   timer.step('Load Editor Component...');
//   const module = await TypefoxMonacoEditorReact.load();
//   timer.end();
//   return { default: module.MonacoEditorReactComp };
// });

export const MonacoEditor = React.lazy(async () => {
  const timer = new ConsoleTimer(true, 'Initialize Monaco Editor Component (only necessary once)').start();
  timer.step('Wait for Monaco API...');
  await MonacoUtil.monaco();
  timer.end();
  return { default: MonacoEditorReactComp };
});
