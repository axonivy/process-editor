import { useReadonly } from '@axonivy/ui-components';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Suspense, lazy, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { MONACO_OPTIONS, MonacoEditorUtil } from '../../../monaco/monaco-editor-util';
import './CodeEditor.css';

const Editor = lazy(async () => {
  const editor = await import('@monaco-editor/react');
  await MonacoEditorUtil.getInstance();
  return editor;
});

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
  const handlePlaceholder = (showPlaceholder: boolean) => {
    if (placeholderElement.current) {
      if (showPlaceholder) {
        placeholderElement.current.style.display = 'block';
      } else {
        placeholderElement.current.style.display = 'none';
      }
    }
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    onMountFuncs?.forEach(func => func(editor));
    handlePlaceholder(editor.getValue() === '');
  };

  const monacoOptions = { ...(options ?? MONACO_OPTIONS) };
  monacoOptions.readOnly = readonly;
  const language = macro ? 'ivyMacro' : 'ivyScript';

  const contextPath = `${elementContext.app}/${elementContext.pmv}/${elementContext.pid}`;

  return (
    <div className='code-editor'>
      <Suspense fallback={<div className='code-input'>{t('label.editorLoading')}</div>}>
        <Editor
          className='code-input'
          defaultValue={value}
          value={value}
          defaultLanguage={language}
          defaultPath={`${language}/${contextPath}/${context.location}/${context.type ? context.type : ''}`}
          options={monacoOptions}
          theme={MonacoEditorUtil.DEFAULT_THEME_NAME}
          onChange={code => {
            handlePlaceholder(!code);
            onChange(code ?? '');
          }}
          onMount={handleEditorDidMount}
          {...props}
        />
      </Suspense>

      <div ref={placeholderElement} className={`monaco-placeholder ${monacoOptions.lineNumbers === 'on' ? 'with-lineNumbers' : ''}`}>
        {t('label.editorPlaceholder')}
      </div>
    </div>
  );
};
