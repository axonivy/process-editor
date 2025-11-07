import { Dialog } from '@radix-ui/react-dialog';
import { type UseBrowserReturnValue } from './useBrowser';
import { IvyIcons } from '@axonivy/ui-icons';
import { MaximizedCodeEditor, type MaximizedCodeEditorProps } from './maximizedCodeEditor/MaximizedCodeEditor';
import BrowserBody from './BrowserBody';
import type { Tab } from '../widgets/tab/Tab';
import { useState } from 'react';

type MaximaziedCodeEditorBrowserProps = UseBrowserReturnValue & MaximizedCodeEditorProps;

export const MaximizedCodeEditorBrowser = ({
  open,
  onOpenChange,
  browsers,
  editorValue,
  applyEditor,
  location,
  selectionRange,
  header,
  macro,
  type
}: MaximaziedCodeEditorBrowserProps) => {
  const [value, setValue] = useState(editorValue);
  if (editorValue !== value && !open) {
    setValue(editorValue);
  }
  const tabs: Tab[] = [
    {
      content: (
        <MaximizedCodeEditor
          applyEditor={setValue}
          browsers={browsers}
          editorValue={value}
          location={location}
          selectionRange={selectionRange}
          open={open}
          keyActions={{
            escape: () => {
              onOpenChange(false);
            }
          }}
          type={type}
          macro={macro}
        />
      ),
      id: 'maxCode',
      name: header?.title ?? 'Code',
      icon: header?.icon ?? IvyIcons.StartProgram
    }
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <BrowserBody activeTab='maxCode' open={open} tabs={tabs} onApply={() => applyEditor(value)} />
      </Dialog>
    </>
  );
};
