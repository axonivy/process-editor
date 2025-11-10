import { useState } from 'react';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import type { BrowserType, BrowserValue } from '../../browser/useBrowser';
import type { DatabaseColumn } from '@axonivy/process-editor-inscription-protocol';

export const monacoAutoFocus = (editor: monaco.editor.IStandaloneCodeEditor) => {
  const range = editor.getModel()?.getFullModelRange();
  if (range) {
    editor.setPosition(range.getEndPosition());
  }
  editor.focus();
};

export const useMonacoEditor = (options?: { macro?: boolean }) => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor>();

  const modifyEditor = (value: BrowserValue, type: BrowserType) => {
    if (!editor) {
      return;
    }
    const selection = editor.getSelection();
    if (!selection) {
      return;
    }

    const text = editorEditText(value, type, options);

    editor.executeEdits('browser', [
      ...firstLineEdits(editor, selection, value.firstLine),
      { range: editorEditRange(editor, type) || selection, text, forceMoveMarkers: true }
    ]);

    if (type === 'func') {
      focusFunctionParameter(editor, text);
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

const editorEditText = (value: BrowserValue, type: BrowserType, options?: { macro?: boolean }): string => {
  if (type === 'tablecol') {
    if (options?.macro) {
      return value.value;
    }
    return `record.getField("${value.value}") as ${(value.data as DatabaseColumn).ivyType}`;
  }
  if (options?.macro) {
    return `<%=${value.value}%>`;
  }
  return value.value;
};

const firstLineEdits = (editor: monaco.editor.IStandaloneCodeEditor, selection: monaco.Selection, firstLine?: string) => {
  if (firstLine) {
    return [
      {
        range: editor.getModel()?.getFullModelRange().collapseToStart() ?? selection,
        text: firstLine,
        forceMoveMarkers: true
      }
    ];
  }
  return [];
};

const editorEditRange = (editor: monaco.editor.IStandaloneCodeEditor, type: BrowserType) => {
  const editorModel = editor.getModel();
  if (type === 'condition' && editorModel) {
    return editorModel.getFullModelRange();
  }
  return undefined;
};

const focusFunctionParameter = (editor: monaco.editor.IStandaloneCodeEditor, text: string) => {
  const updatedEditorContent = editor.getValue();
  const editorModel = editor.getModel();
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
};
