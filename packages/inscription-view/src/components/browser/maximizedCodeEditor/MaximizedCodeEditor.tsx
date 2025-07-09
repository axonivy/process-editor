import './MaximizedCodeEditor.css';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { useBrowser, type BrowserType } from '../useBrowser';
import { monacoAutoFocus, useMonacoEditor } from '../../widgets/code-editor/useCodeEditor';
import { CodeEditor } from '../../widgets/code-editor/CodeEditor';
import Browser from '../Browser';
import { MAXIMIZED_MONACO_OPTIONS, MonacoEditorUtil } from '../../../monaco/monaco-editor-util';
import type { IvyIcons } from '@axonivy/ui-icons';

export type MaximizedCodeEditorProps = {
  editorValue: string;
  location: string;
  browsers: BrowserType[];
  applyEditor: (change: string) => void;
  selectionRange: monaco.IRange | null;
  open: boolean;
  keyActions?: {
    escape?: () => void;
  };
  macro?: boolean;
  type?: string;
  header?: {
    title?: string;
    icon?: IvyIcons;
  };
};

export const MaximizedCodeEditor = ({
  editorValue,
  location,
  browsers,
  applyEditor,
  selectionRange,
  keyActions,
  macro,
  type,
  open
}: MaximizedCodeEditorProps) => {
  const { setEditor, modifyEditor, getMonacoSelection } = useMonacoEditor(macro ? { modifyAction: value => `<%=${value}%>` } : undefined);
  const browser = useBrowser();

  const setSelection = (editor: monaco.editor.IStandaloneCodeEditor) => {
    if (selectionRange !== null) {
      editor.setSelection(selectionRange);
    }
  };
  const keyActionMountFunc = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.addCommand(MonacoEditorUtil.KeyCode.Escape, () => {
      if (keyActions?.escape) {
        keyActions.escape();
      }
    });
  };

  const delayedMonacoAutoFocus = (editor: monaco.editor.IStandaloneCodeEditor) => {
    const handleAnimationEnd = () => {
      monacoAutoFocus(editor);
      document.querySelector('.browser-dialog')?.removeEventListener('animationend', handleAnimationEnd);
    };

    const dialogElement = document.querySelector('.browser-dialog');
    if (dialogElement) {
      dialogElement.addEventListener('animationend', handleAnimationEnd);
    }
  };

  return (
    open && (
      <div className='maximized-script-area'>
        <div className='maximized-code-editor'>
          <CodeEditor
            value={editorValue}
            onChange={applyEditor}
            context={{ type, location }}
            onMountFuncs={[setEditor, delayedMonacoAutoFocus, setSelection, keyActionMountFunc]}
            options={MAXIMIZED_MONACO_OPTIONS}
            macro={macro}
          />
        </div>
        <Browser {...browser} types={browsers} accept={modifyEditor} location={location} initSearchFilter={getMonacoSelection} />
      </div>
    )
  );
};
