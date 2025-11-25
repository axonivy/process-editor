/* Inspired by https://github.com/suren-atoyan/monaco-react */

import type { ITextFileEditorModel } from '@codingame/monaco-vscode-api/monaco';
import type { IReference } from '@codingame/monaco-vscode-editor-service-override';
import React, { useEffect, useRef, useState } from 'react';
import { IvyScriptLanguage } from './ivy-script-language';
import type { MonacoApi, monaco } from './monaco-modules';
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
        console.debug('[MonacoEditorComponent][Monaco] Loaded.');
        setMonaco(instance);
      }
    });

    return () => {
      console.debug('[MonacoEditorComponent][Monaco] Loading Cancelled.');
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

    console.debug('[MonacoEditorComponent][ModelReference] Creating:', monacoUri.toString());
    monaco.editor.createModelReference(monacoUri, content).then(newModelReference => {
      if (cancelled) {
        console.debug('[MonacoEditorComponent][ModelReference] Creation Cancelled:', monacoUri.toString());
        newModelReference.dispose();
        return;
      }

      console.debug('[MonacoEditorComponent][ModelReference] Created:', monacoUri.toString());
      modelReferenceRef.current = newModelReference;
      newModelReference.object.setLanguageId(language);
      setModelReference(newModelReference);
    });

    return () => {
      console.debug('[MonacoEditorComponent][ModelReference] Dispose:', monacoUri.toString());
      cancelled = true;
      modelReferenceRef.current?.dispose();
      modelReferenceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monaco, uri]);

  useEffect(() => {
    console.debug('[MonacoEditorComponent][ModelReference] Set Language:', language);
    modelReference?.object.setLanguageId(language);
  }, [modelReference, language]);

  useEffect(() => {
    // Skip if this is an echo from our own change
    if (isLocalChangeRef.current) {
      console.debug('[MonacoEditorComponent][Content] Skip Updating Editor Content: Local (User Typing). Reset Local Flag.');
      isLocalChangeRef.current = false;
      return;
    }

    if (content !== undefined && modelReference && modelReference.object.textEditorModel) {
      const currentValue = modelReference.object.textEditorModel.getValue();
      if (currentValue !== content) {
        // Mark as programmatic to suppress event propagation
        console.debug('[MonacoEditorComponent][Content] Update Editor Content From External:', content);
        console.debug('[MonacoEditorComponent][Content] Set External Flag.');
        isExternalUpdateRef.current = true;
        modelReference.object.textEditorModel.setValue(content);
        console.debug('[MonacoEditorComponent][Content] Reset External Flag.');
        isExternalUpdateRef.current = false;
      } else {
        console.debug('[MonacoEditorComponent][Content] Skip Updating Editor Content: Same Value');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  // Store the last value we synced from either direction (local or external)
  const lastSyncedValueRef = useRef<string | undefined>(undefined);

  const monaco = useMonacoInstance();
  const modelReference = useMonacoModelReference(monaco, uri, language, content, isLocalChangeRef, isExternalUpdateRef);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onContentChangeRef = useRef(onDidContentChange);

  useEffect(() => {
    // if we do not have a stable onDidContentChange, this useEffect will be triggered on every render
    // in order to not re-subscribe to the editor event on every render, we store the latest callback in a ref
    // and use that in the event listener instead
    onContentChangeRef.current = onDidContentChange;
  }, [onDidContentChange]);

  useEffect(() => {
    if (!monaco || !modelReference || !containerRef.current) {
      return;
    }

    if (editorRef.current) {
      editorRef.current.setModel(modelReference.object.textEditorModel);
      console.debug('[MonacoEditorComponent][Editor] Update Model.');
      return;
    }

    console.debug('[MonacoEditorComponent][Editor] Creating.');
    const newEditor = monaco.editor.create(containerRef.current, {
      model: modelReference.object.textEditorModel,
      automaticLayout: true,
      ...options
    });

    editorRef.current = newEditor;
    console.debug('[MonacoEditorComponent][Editor] Created: Notify Creation Callback.');
    onIsEditorReady?.(newEditor);

    const changeListener = newEditor.onDidChangeModelContent(() => {
      // Ignore external updates as the outside is already aware of it
      if (isExternalUpdateRef.current) {
        console.debug('[MonacoEditorComponent][Content] Skip Notifying Callback: External Value.');
        return;
      }

      const newValue = newEditor.getValue();

      // Only emit if value actually changed
      if (newValue !== lastSyncedValueRef.current) {
        lastSyncedValueRef.current = newValue;
        console.debug('[MonacoEditorComponent][Content] Set Local Flag.');
        isLocalChangeRef.current = true;
        console.debug('[MonacoEditorComponent][Content] Notify Change Callback:', newValue);
        onContentChangeRef.current?.(newValue);
      } else {
        console.debug('[MonacoEditorComponent][Content] Skip Notifying Callback: Same Value as Last Emitted');
      }
    });

    return () => {
      console.debug('[MonacoEditorComponent][Editor] Dispose Change Listener.');
      changeListener.dispose();
      console.debug('[MonacoEditorComponent][Editor] Dispose Editor.');
      editorRef.current?.dispose();
      editorRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monaco, modelReference]);

  useEffect(() => {
    console.debug('[MonacoEditorComponent][Editor] Update Options.');
    editorRef.current?.updateOptions(options);
  }, [options]);

  useEffect(() => {
    if (!isLocalChangeRef.current && content !== undefined) {
      console.debug('[MonacoEditorComponent][Content] Set Synced Value:', content);
      lastSyncedValueRef.current = content;
    }
  }, [content]);

  return <div ref={containerRef} {...divProps} />;
};

export const MonacoEditorReactComp = React.memo(InternalMonacoEditorReactComp);
