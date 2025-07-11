import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useState } from 'react';
import type { BrowserValue } from '../../browser/Browser';
import type { BrowserType } from '../../browser/useBrowser';

export const monacoAutoFocus = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const range = editor.getModel()?.getFullModelRange();
  if (range) {
    editor.setPosition(range.getEndPosition());
  }
  editor.focus();
};

export type ModifyAction = (value: string) => string;

export const useMonacoEditor = (options?: { modifyAction?: ModifyAction }) => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();

  const modifyEditor = (value: BrowserValue, type: BrowserType) => {
    if (!editor) {
      return;
    }
    const selection = editor.getSelection();
    if (!selection) {
      return;
    }
    if (value.firstLineValue) {
      editor.executeEdits('browser', [
        {
          range: editor.getModel()?.getFullModelRange().collapseToStart() ?? selection,
          text: value.firstLineValue ? value.firstLineValue : '',
          forceMoveMarkers: true
        },
        {
          range: selection,
          text: value.cursorValue,
          forceMoveMarkers: true
        }
      ]);
    } else {
      const text =
        value.cursorValue.length > 0 && options?.modifyAction && type !== 'tablecol'
          ? options.modifyAction(value.cursorValue)
          : value.cursorValue;
      const editorModel = editor.getModel();
      if (type === 'condition' && editorModel) {
        editor.executeEdits('browser', [
          {
            range: editorModel.getFullModelRange(),
            text,
            forceMoveMarkers: true
          }
        ]);
      } else {
        editor.executeEdits('browser', [{ range: selection, text, forceMoveMarkers: true }]);
      }
      if (type === 'func') {
        const updatedEditorContent = editor.getValue();
        if (editorModel && text.indexOf('(') !== -1) {
          const textIndex = updatedEditorContent.indexOf(text);

          const textrange = {
            startLineNumber: editorModel.getPositionAt(textIndex).lineNumber,
            startColumn: editorModel.getPositionAt(textIndex + 1 + text.indexOf('(')).column,
            endLineNumber: editorModel.getPositionAt(textIndex + text.length).lineNumber,
            endColumn: editorModel.getPositionAt(textIndex + text.indexOf(')')).column
          };

          setTimeout(() => {
            editor.setSelection(textrange);
            editor.focus();
          }, 500);
        }
      }
    }
  };

  const getSelectionRange = (): monaco.IRange | null => {
    const selection = editor?.getSelection();
    if (selection) {
      return {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn
      };
    } else {
      return null;
    }
  };

  const getMonacoSelection: () => string = () => {
    const selection = editor?.getSelection();
    if (selection) {
      return editor?.getModel()?.getValueInRange(selection) || '';
    }
    return '';
  };

  return { setEditor, modifyEditor, getMonacoSelection, getSelectionRange };
};
