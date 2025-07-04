import './ScriptArea.css';
import type { CodeEditorAreaProps } from './ResizableCodeEditor';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { ResizableCodeEditor } from './ResizableCodeEditor';
import { useMonacoEditor } from './useCodeEditor';
import { MaximizedCodeEditorBrowser } from '../../browser/MaximizedCodeEditorBrowser';
import { MonacoEditorUtil } from '../../../monaco/monaco-editor-util';
import { useField } from '@axonivy/ui-components';
import { useBrowser } from '../../browser/useBrowser';
import { usePath } from '../../../context/usePath';
import Browser from '../../browser/Browser';

type ScriptAreaProps = CodeEditorAreaProps & {
  maximizeState: {
    isMaximizedCodeEditorOpen: boolean;
    setIsMaximizedCodeEditorOpen: (open: boolean) => void;
  };
};

export const ScriptArea = (props: ScriptAreaProps) => {
  const browser = useBrowser();
  const { setEditor, modifyEditor, getMonacoSelection, getSelectionRange } = useMonacoEditor();
  const path = usePath();
  const keyActionMountFunc = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.addCommand(MonacoEditorUtil.KeyCode.F2, () => {
      props.maximizeState.setIsMaximizedCodeEditorOpen(true);
    });
  };
  const setScrollPosition = (editor: monaco.editor.IStandaloneCodeEditor) => {
    const text = editor.getValue();
    const importRegex = /^import .+;/gm;
    const importMatches = text.match(importRegex);
    const importAmount = importMatches ? importMatches.length : 0;
    editor.revealLine(importAmount + 1);
  };

  const { inputProps } = useField();

  return (
    <>
      <MaximizedCodeEditorBrowser
        open={props.maximizeState.isMaximizedCodeEditorOpen}
        onOpenChange={props.maximizeState.setIsMaximizedCodeEditorOpen}
        browsers={props.browsers}
        editorValue={props.value}
        location={path}
        applyEditor={props.onChange}
        selectionRange={getSelectionRange()}
      />
      {!props.maximizeState.isMaximizedCodeEditorOpen && (
        <div className='script-area'>
          <ResizableCodeEditor
            {...inputProps}
            {...props}
            initHeight={props.value.length > 0 ? () => 350 : undefined}
            location={path}
            onMountFuncs={[setEditor, keyActionMountFunc, MonacoEditorUtil.keyActionEscShiftTab, setScrollPosition]}
          />
          <Browser {...browser} types={props.browsers} accept={modifyEditor} location={path} initSearchFilter={getMonacoSelection} />
        </div>
      )}
    </>
  );
};
