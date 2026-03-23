import { useCallback } from 'react';
import { MonacoEditorUtil, SINGLE_LINE_MONACO_OPTIONS } from '../../../monaco/monaco-editor-util';
import type { monaco } from '../../../monaco/monaco-modules';
import { focusAdjacentTabIndexMonaco } from '../../../utils/focus';
import type { BrowserType } from '../../browser/useBrowser';
import type { CodeEditorProps } from './CodeEditor';
import { CodeEditor } from './CodeEditor';
import { monacoAutoFocus } from './useCodeEditor';

type EditorOptions = {
  editorOptions?: {
    fixedOverflowWidgets?: boolean;
  };
  keyActions?: {
    enter?: () => void;
    tab?: () => void;
    escape?: () => void;
    arrowDown?: () => void;
    arrowUp?: () => void;
  };
};

export type CodeEditorInputProps = Omit<CodeEditorProps, 'macro' | 'options' | 'onMount' | 'height' | 'onMountFuncs' | 'context'> &
  EditorOptions & { browsers: BrowserType[]; placeholder?: string };

export const SingleLineCodeEditor = ({ onChange, onMountFuncs, editorOptions, keyActions, ...props }: CodeEditorProps & EditorOptions) => {
  const mountFuncs = onMountFuncs ? onMountFuncs : [];

  const singleLineMountFuncs = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.createContextKey('singleLine', true);
    const triggerAcceptSuggestion = (editor: monaco.editor.IStandaloneCodeEditor) =>
      editor.trigger(undefined, 'acceptSelectedSuggestion', undefined);
    editor.addCommand(
      MonacoEditorUtil.KeyCode.Enter,
      () => {
        if (MonacoEditorUtil.isSuggestWidgetOpen(editor)) {
          triggerAcceptSuggestion(editor);
        } else if (keyActions?.enter) {
          keyActions.enter();
        }
      },
      'singleLine'
    );
    editor.addCommand(
      MonacoEditorUtil.KeyCode.Tab,
      () => {
        if (MonacoEditorUtil.isSuggestWidgetOpen(editor)) {
          triggerAcceptSuggestion(editor);
        } else {
          if (editor.hasTextFocus() && document.activeElement instanceof HTMLElement) {
            focusAdjacentTabIndexMonaco('next');
          }
          if (keyActions?.tab) {
            keyActions.tab();
          }
        }
      },
      'singleLine'
    );
    editor.addCommand(
      MonacoEditorUtil.KeyCode.DownArrow,
      () => {
        if (MonacoEditorUtil.isSuggestWidgetOpen(editor)) {
          editor.trigger(undefined, 'selectNextSuggestion', undefined);
        } else if (keyActions?.arrowDown) {
          keyActions.arrowDown();
        }
      },
      'singleLine'
    );
    editor.addCommand(
      MonacoEditorUtil.KeyCode.UpArrow,
      () => {
        if (MonacoEditorUtil.isSuggestWidgetOpen(editor)) {
          editor.trigger(undefined, 'selectPrevSuggestion', undefined);
        } else if (keyActions?.arrowUp) {
          keyActions.arrowUp();
        }
      },
      'singleLine'
    );
    editor.addCommand(
      MonacoEditorUtil.KeyCode.Shift | MonacoEditorUtil.KeyCode.Tab,
      () => {
        if (editor.hasTextFocus() && document.activeElement instanceof HTMLElement) {
          focusAdjacentTabIndexMonaco('previous');
        }
      },
      'singleLine'
    );
    editor.addCommand(
      MonacoEditorUtil.KeyCode.Escape,
      () => {
        if (MonacoEditorUtil.isSuggestWidgetOpen(editor)) {
          editor.trigger(undefined, 'hideSuggestWidget', undefined);
        } else if (keyActions?.escape) {
          keyActions.escape();
        }
      },
      'singleLine'
    );
  };

  const onCodeChange = useCallback<(code: string) => void>(
    code => {
      code = code.replace(/[\n\r]/g, '');
      onChange(code);
    },
    [onChange]
  );

  return (
    <CodeEditor
      height={42}
      onChange={onCodeChange}
      options={editorOptions ? { ...SINGLE_LINE_MONACO_OPTIONS, ...editorOptions } : SINGLE_LINE_MONACO_OPTIONS}
      onMountFuncs={[...mountFuncs, monacoAutoFocus, singleLineMountFuncs]}
      {...props}
    />
  );
};
