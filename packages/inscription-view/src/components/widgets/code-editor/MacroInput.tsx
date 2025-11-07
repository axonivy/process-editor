import { InputBadge, useField } from '@axonivy/ui-components';
import { useOnFocus } from '../../../components/browser/useOnFocus';
import { usePath } from '../../../context/usePath';
import { badgePropsExpression } from '../../../utils/badgeproperties';
import Browser from '../../browser/Browser';
import './ScriptInput.css';
import type { CodeEditorInputProps } from './SingleLineCodeEditor';
import { SingleLineCodeEditor } from './SingleLineCodeEditor';
import { useMonacoEditor } from './useCodeEditor';

type MacroInputProps = Omit<CodeEditorInputProps, 'context'>;

export const MacroInput = ({ value, onChange, browsers, ...props }: MacroInputProps) => {
  const { isFocusWithin, focusWithinProps, focusValue, browser } = useOnFocus(value, onChange);
  const { setEditor, modifyEditor } = useMonacoEditor({ macro: true });
  const path = usePath();
  const { inputProps } = useField();

  return (
    // tabIndex is needed for safari to catch the focus when click on browser button
    <div className='script-input' {...focusWithinProps} tabIndex={1}>
      {isFocusWithin ? (
        <>
          <SingleLineCodeEditor
            {...focusValue}
            {...inputProps}
            {...props}
            context={{ location: path }}
            macro={true}
            onMountFuncs={[setEditor]}
          />
          <Browser {...browser} types={browsers} accept={modifyEditor} location={path} />
        </>
      ) : (
        <InputBadge
          badgeProps={badgePropsExpression}
          value={value}
          tabIndex={0}
          style={{ overflow: 'hidden' }}
          {...inputProps}
          {...props}
        />
      )}
    </div>
  );
};
