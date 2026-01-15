import { InputCell } from '@axonivy/ui-components';
import type { CellContext } from '@tanstack/react-table';
import type { BrowserType } from '../../../browser/useBrowser';
import { CodeEditorCell } from './CodeEditorCell';

export const ScriptCell = <TData,>({
  cell,
  type,
  browsers,
  placeholder
}: {
  cell: CellContext<TData, string>;
  type: string;
  browsers: BrowserType[];
  placeholder?: string;
}) => {
  if (type === undefined || type.length === 0) {
    return (
      <div className='code-input'>
        <InputCell className='script-cell view-lines' cell={cell} placeholder={placeholder} />
      </div>
    );
  }
  return <CodeEditorCell cell={cell} macro={false} type={type} browsers={browsers} placeholder={placeholder} />;
};
