import { useField } from '@axonivy/ui-components';
import { usePath } from '../../../context/usePath';
import type { monaco } from '../../../monaco';
import { MonacoEditorUtil } from '../../../monaco/monaco-editor-util';
import Browser from '../../browser/Browser';
import { MaximizedCodeEditorBrowser } from '../../browser/MaximizedCodeEditorBrowser';
import { useBrowser } from '../../browser/useBrowser';
import type { CodeEditorAreaProps } from './ResizableCodeEditor';
import { ResizableCodeEditor } from './ResizableCodeEditor';
import './ScriptArea.css';
import { useMonacoEditor } from './useCodeEditor';

type ScriptAreaProps = CodeEditorAreaProps & {
  maximizeState: {
    isMaximizedCodeEditorOpen: boolean;
    setIsMaximizedCodeEditorOpen: (open: boolean) => void;
  };
};

export const ScriptArea = ({ maximizeState, ...props }: ScriptAreaProps) => {
  const browser = useBrowser();
  const { setEditor, modifyEditor, getMonacoSelection, getSelectionRange } = useMonacoEditor();
  const path = usePath();
  const keyActionMountFunc = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.addCommand(MonacoEditorUtil.KeyCode.F2, () => {
      maximizeState.setIsMaximizedCodeEditorOpen(true);
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
        open={maximizeState.isMaximizedCodeEditorOpen}
        onOpenChange={maximizeState.setIsMaximizedCodeEditorOpen}
        browsers={props.browsers}
        editorValue={props.value}
        location={path}
        applyEditor={props.onChange}
        selectionRange={getSelectionRange()}
      />
      {!maximizeState.isMaximizedCodeEditorOpen && (
        <div className='script-area'>
          <ResizableCodeEditor
            {...inputProps}
            {...props}
            initHeight={props.value.length > 0 ? () => 400 : undefined}
            location={path}
            onMountFuncs={[setEditor, keyActionMountFunc, MonacoEditorUtil.keyActionEscShiftTab, setScrollPosition]}
          />
          <Browser {...browser} types={props.browsers} accept={modifyEditor} location={path} initSearchFilter={getMonacoSelection} />
        </div>
      )}
    </>
  );
};
