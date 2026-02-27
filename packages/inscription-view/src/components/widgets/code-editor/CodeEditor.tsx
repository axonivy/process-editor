import { Flex, useReadonly } from '@axonivy/ui-components';
import React, { Suspense, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { IvyMacroLanguage } from '../../../monaco/ivy-macro-language';
import { IvyScriptLanguage } from '../../../monaco/ivy-script-language';
import { MONACO_OPTIONS, MonacoEditor, MonacoEditorUtil, useLanguageClientSessionId } from '../../../monaco/monaco-editor-util';
import type { monaco } from '../../../monaco/monaco-modules';
import './CodeEditor.css';

export type CodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
  context: { location: string; type?: string };
  macro?: boolean;
  height?: number;
  onMountFuncs?: Array<(editor: monaco.editor.IStandaloneCodeEditor) => void>;
  options?: monaco.editor.IStandaloneEditorConstructionOptions;
};

export const CodeEditor = ({ value, onChange, context, macro, onMountFuncs, options, ...props }: CodeEditorProps) => {
  const sessionId = useLanguageClientSessionId();
  const { t } = useTranslation();
  const { elementContext } = useEditorContext();
  const readonly = useReadonly();
  const placeholderElement = useRef<HTMLDivElement>(null);

  const monacoOptions = useMemo(() => ({ ...(options ?? MONACO_OPTIONS), readOnly: readonly }), [options, readonly]);
  const contextPath = `${elementContext.app}/${elementContext.pmv}/${elementContext.pid}`;
  const language = macro ? IvyMacroLanguage.Language.id : IvyScriptLanguage.Language.id;

  const updatePlaceholder = (showPlaceholder: boolean) => {
    if (placeholderElement.current) {
      placeholderElement.current.style.display = showPlaceholder ? 'block' : 'none';
    }
  };

  const onIsEditorReady = React.useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      onMountFuncs?.forEach(func => func(editor));
      updatePlaceholder(editor.getValue() === '');
    },
    [onMountFuncs]
  );

  const onDidContentChange = React.useCallback(
    (content?: string) => {
      const text = content ?? '';
      updatePlaceholder(text.length === 0);
      onChange(text);
    },
    [onChange]
  );

  return (
    <div className='code-editor' key={`${contextPath}-${sessionId}`}>
      <Suspense
        fallback={
          <Flex alignItems='center' className='code-input loading' style={{ height: props.height }} tabIndex={0}>
            {t('label.editorLoading')}
          </Flex>
        }
      >
        <MonacoEditor
          key={contextPath}
          defaultPath={`${language}/${contextPath}/${context.location}/${context.type ? context.type : ''}`}
          defaultLanguage={language}
          defaultValue={value}
          value={value}
          theme={MonacoEditorUtil.theme}
          className='code-input'
          options={monacoOptions}
          onChange={onDidContentChange}
          onMount={onIsEditorReady}
          {...props}
        />
      </Suspense>

      <div ref={placeholderElement} className={`monaco-placeholder ${monacoOptions.lineNumbers === 'on' ? 'with-lineNumbers' : ''}`}>
        {t('label.editorPlaceholder')}
      </div>
    </div>
  );
};
