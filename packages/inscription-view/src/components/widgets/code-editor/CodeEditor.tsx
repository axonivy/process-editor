import { Flex, useReadonly } from '@axonivy/ui-components';
import React, { Suspense, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { MONACO_OPTIONS, MonacoEditor } from '../../../monaco/monaco-editor-util';
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
  const { t } = useTranslation();
  const { elementContext } = useEditorContext();
  const readonly = useReadonly();
  const placeholderElement = useRef<HTMLDivElement>(null);

  const monacoOptions = useMemo(() => ({ ...(options ?? MONACO_OPTIONS), readOnly: readonly }), [options, readonly]);
  const contextPath = `${elementContext.app}/${elementContext.pmv}/${elementContext.pid}`;
  const language = macro ? 'ivyMacro' : 'ivyScript';

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
    (content: string) => {
      updatePlaceholder(content.length === 0);
      onChange(content);
    },
    [onChange]
  );

  return (
    <div className='code-editor' key={contextPath}>
      <Suspense
        fallback={
          <Flex alignItems='center' className='code-input loading' style={{ height: props.height }} tabIndex={0}>
            {t('label.editorLoading')}
          </Flex>
        }
      >
        <MonacoEditor
          key={contextPath}
          uri={`${language}/${contextPath}/${context.location}/${context.type ? context.type : ''}`}
          language={language}
          content={value}
          className='code-input'
          options={monacoOptions}
          onDidContentChange={onDidContentChange}
          onIsEditorReady={onIsEditorReady}
          style={{ height: props.height, maxHeight: props.height }}
          {...props}
        />
      </Suspense>

      <div ref={placeholderElement} className={`monaco-placeholder ${monacoOptions.lineNumbers === 'on' ? 'with-lineNumbers' : ''}`}>
        {t('label.editorPlaceholder')}
      </div>
    </div>
  );
};
