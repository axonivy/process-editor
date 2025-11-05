/* Inspired by https://github.com/suren-atoyan/monaco-react */
/* eslint-disable react-hooks/exhaustive-deps */

import { type ITextFileEditorModel } from '@codingame/monaco-vscode-api/monaco';
import type { IReference } from '@codingame/monaco-vscode-editor-service-override';
import React, { useEffect, useRef, useState } from 'react';
import { IvyScriptLanguage } from './ivy-script-language';
import { type MonacoApi, type monaco } from './monaco-modules';
import { MonacoUtil } from './monaco-util';

export type MonacoEditorProps = {
  // content properties
  uri: string;
  language?: string;
  content?: string;

  // editor properties
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
  onIsEditorReady?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onDidContentChange?: (content: string) => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'>;

export const useMonacoInstance = () => {
  const [monaco, setMonaco] = useState<MonacoApi | null>(null);

  // load on mount
  useEffect(() => {
    let cancelled = false;

    MonacoUtil.monaco().then(instance => {
      if (!cancelled) {
        setMonaco(instance);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return monaco;
};

export const useMonacoModelReference = (
  monaco: MonacoApi | null,
  uri: string,
  language: string,
  content: string | undefined,
  isLocalChangeRef: React.RefObject<boolean>,
  isExternalUpdateRef: React.RefObject<boolean>
) => {
  const [modelReference, setModelReference] = useState<IReference<ITextFileEditorModel> | null>(null);
  const modelReferenceRef = useRef<IReference<ITextFileEditorModel> | null>(null);

  useEffect(() => {
    if (!monaco) {
      return;
    }

    const monacoUri = monaco.Uri.parse(uri);
    let cancelled = false;

    monaco.editor.createModelReference(monacoUri, content).then(newModelReference => {
      if (cancelled) {
        newModelReference.dispose();
        return;
      }

      modelReferenceRef.current = newModelReference;
      newModelReference.object.setLanguageId(language);
      setModelReference(newModelReference);
    });

    return () => {
      cancelled = true;
      modelReferenceRef.current?.dispose();
      modelReferenceRef.current = null;
    };
  }, [monaco, uri]);

  useEffect(() => {
    modelReference?.object.setLanguageId(language);
  }, [modelReference, language]);

  useEffect(() => {
    // Skip if this is an echo from our own change
    if (isLocalChangeRef.current) {
      isLocalChangeRef.current = false;
      return;
    }

    if (content !== undefined && modelReference) {
      const currentValue = modelReference.object.textEditorModel.getValue();
      if (currentValue !== content) {
        // Mark as programmatic to suppress event propagation
        isExternalUpdateRef.current = true;
        modelReference.object.textEditorModel.setValue(content);
        isExternalUpdateRef.current = false;
      }
    }
  }, [modelReference, content]);

  return modelReference;
};

const InternalMonacoEditorReactComp: React.FC<MonacoEditorProps> = ({
  uri,
  language = IvyScriptLanguage.Language.id,
  content,
  options = {},
  onIsEditorReady,
  onDidContentChange,
  ...divProps
}: MonacoEditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Track if the value change originated from user typing
  const isLocalChangeRef = useRef(false);
  // Track if we're getting an external value update
  const isExternalUpdateRef = useRef(false);
  // Store the last value we sent to external
  const lastEmittedValueRef = useRef<string | undefined>(undefined);

  const monaco = useMonacoInstance();
  const modelReference = useMonacoModelReference(monaco, uri, language, content, isLocalChangeRef, isExternalUpdateRef);

  const container = containerRef.current;
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onContentChangeRef = useRef(onDidContentChange);

  useEffect(() => {
    onContentChangeRef.current = onDidContentChange;
  }, [onDidContentChange]);

  useEffect(() => {
    if (!monaco || !modelReference || !container) {
      return;
    }

    if (editorRef.current) {
      editorRef.current.setModel(modelReference.object.textEditorModel);
      return;
    }

    const newEditor = monaco.editor.create(container, {
      model: modelReference.object.textEditorModel,
      automaticLayout: true,
      ...options
    });

    editorRef.current = newEditor;
    onIsEditorReady?.(newEditor);

    const changeListener = newEditor.onDidChangeModelContent(() => {
      // Ignore external updates as the outside is already aware of it
      if (isExternalUpdateRef.current) {
        return;
      }

      const newValue = newEditor.getValue();

      // Only emit if value actually changed
      if (newValue !== lastEmittedValueRef.current) {
        lastEmittedValueRef.current = newValue;
        isLocalChangeRef.current = true;
        onContentChangeRef.current?.(newValue);
      }
    });

    return () => {
      changeListener.dispose();
      editorRef.current?.dispose();
      editorRef.current = null;
    };
  }, [monaco, container, modelReference]);

  useEffect(() => {
    editorRef.current?.updateOptions(options);
  }, [options]);

  useEffect(() => {
    if (!isLocalChangeRef.current && content !== undefined) {
      lastEmittedValueRef.current = content;
    }
  }, [content]);

  return <div ref={containerRef} {...divProps} />;
};

export const MonacoEditorReactComp = React.memo(InternalMonacoEditorReactComp);
