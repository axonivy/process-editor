import './CodeEditorCell.css';
import type { CellContext } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useMonacoEditor } from '../../code-editor/useCodeEditor';
import { useOnFocus } from '../../../browser/useOnFocus';
import useMaximizedCodeEditor from '../../../browser/useMaximizedCodeEditor';
import { Button, selectNextPreviousCell } from '@axonivy/ui-components';
import { type BrowserType } from '../../../browser/useBrowser';
import { usePath } from '../../../../context/usePath';
import { MaximizedCodeEditorBrowser } from '../../../browser/MaximizedCodeEditorBrowser';
import { SingleLineCodeEditor } from '../../code-editor/SingleLineCodeEditor';
import Browser from '../../../browser/Browser';
import Input from '../../input/Input';
import { focusAdjacentTabIndexMonaco } from '../../../../utils/focus';

type CodeEditorCellProps<TData> = {
  cell: CellContext<TData, string>;
  macro: boolean;
  type?: string;
  placeholder?: string;
  browsers: BrowserType[];
};

export function CodeEditorCell<TData>({ cell, macro, type, browsers, placeholder }: CodeEditorCellProps<TData>) {
  const initialValue = cell.getValue() as string;
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const { setEditor, modifyEditor, getSelectionRange } = useMonacoEditor(macro ? { modifyAction: value => `<%=${value}%>` } : undefined);
  const path = usePath();

  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  const updateValue = (newValue: string) => {
    setValue(newValue);
    if (newValue !== cell.getValue() && !maximizeState.isMaximizedCodeEditorOpen) {
      cell.table.options.meta?.updateData(cell.row.id, cell.column.id, newValue);
    }
  };

  const { isFocusWithin, focusWithinProps, focusValue, browser } = useOnFocus(value, updateValue);

  useEffect(() => {
    if (isFocusWithin && !cell.row.getIsSelected()) {
      cell.row.toggleSelected();
    }
  }, [cell.row, isFocusWithin]);

  return (
    <div className='script-input' {...focusWithinProps} tabIndex={1}>
      {isFocusWithin || maximizeState.isMaximizedCodeEditorOpen ? (
        <>
          <MaximizedCodeEditorBrowser
            open={maximizeState.isMaximizedCodeEditorOpen}
            onOpenChange={maximizeState.setIsMaximizedCodeEditorOpen}
            browsers={browsers}
            editorValue={value}
            location={path}
            applyEditor={updateValue}
            selectionRange={getSelectionRange()}
            macro={macro}
            type={type}
          />
          {!maximizeState.isMaximizedCodeEditorOpen && (
            <>
              <SingleLineCodeEditor
                {...focusValue}
                context={{ type, location: path }}
                keyActions={{
                  enter: () => focusAdjacentTabIndexMonaco('next', 2),
                  escape: () => focusAdjacentTabIndexMonaco('next', 2),
                  arrowDown: () => {
                    if (document.activeElement) {
                      selectNextPreviousCell(document.activeElement, cell, 1);
                    }
                  },
                  arrowUp: () => {
                    if (document.activeElement) {
                      selectNextPreviousCell(document.activeElement, cell, -1);
                    }
                  }
                }}
                onMountFuncs={[setEditor]}
                macro={macro}
              />
              <Browser {...browser} types={browsers} accept={modifyEditor} location={path} />
            </>
          )}
          <Button
            className='maximize-code-button'
            onClick={maximizeCode.action}
            title={maximizeCode.label}
            aria-label={maximizeCode.label}
            toggle={maximizeCode.active}
            icon={maximizeCode.icon}
          />
        </>
      ) : (
        <Input value={value} onChange={setValue} placeholder={placeholder} onBlur={() => updateValue(value)} />
      )}
    </div>
  );
}
