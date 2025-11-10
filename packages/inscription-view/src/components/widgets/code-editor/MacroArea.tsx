import './ScriptArea.css';
import type { CodeEditorAreaProps } from './ResizableCodeEditor';
import { ResizableCodeEditor } from './ResizableCodeEditor';
import { monacoAutoFocus, useMonacoEditor } from './useCodeEditor';
import { useRef } from 'react';
import { useOnFocus } from '../../../components/browser/useOnFocus';
import { InputBadgeArea, useField } from '@axonivy/ui-components';
import { badgePropsExpression } from '../../../utils/badgeproperties';
import { MaximizedCodeEditorBrowser } from '../../browser/MaximizedCodeEditorBrowser';
import Browser from '../../browser/Browser';
import { usePath } from '../../../context/usePath';
import { MonacoEditorUtil } from '../../../monaco/monaco-editor-util';

export const MacroArea = ({ value, onChange, browsers, ...props }: CodeEditorAreaProps) => {
  const { isFocusWithin, focusWithinProps, focusValue, browser } = useOnFocus(value, onChange);
  const { setEditor, modifyEditor, getSelectionRange } = useMonacoEditor({ macro: true });
  const path = usePath();
  const areaRef = useRef<HTMLOutputElement>(null);
  const { inputProps } = useField();

  return (
    // tabIndex is needed for safari to catch the focus when click on browser button
    <div className='script-area' {...focusWithinProps} tabIndex={1}>
      {isFocusWithin || props.maximizeState?.isMaximizedCodeEditorOpen ? (
        <>
          {props.maximizeState && (
            <MaximizedCodeEditorBrowser
              open={props.maximizeState.isMaximizedCodeEditorOpen}
              onOpenChange={props.maximizeState.setIsMaximizedCodeEditorOpen}
              browsers={browsers}
              editorValue={value}
              location={path}
              applyEditor={onChange}
              selectionRange={getSelectionRange()}
              macro={true}
              header={props.maximizedHeader}
            />
          )}
          {!props.maximizeState?.isMaximizedCodeEditorOpen && (
            <>
              <ResizableCodeEditor
                {...focusValue}
                {...inputProps}
                {...props}
                location={path}
                onMountFuncs={[setEditor, monacoAutoFocus, MonacoEditorUtil.keyActionEscShiftTab]}
                macro={true}
                initHeight={() => areaRef.current?.clientHeight ?? 90}
              />
              <Browser {...browser} types={browsers} accept={modifyEditor} location={path} />
            </>
          )}
        </>
      ) : (
        <InputBadgeArea badgeProps={badgePropsExpression} value={value} tabIndex={0} {...inputProps} {...props} ref={areaRef} />
      )}
    </div>
  );
};
