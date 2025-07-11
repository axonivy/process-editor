import { IvyIcons } from '@axonivy/ui-icons';
import { Dialog } from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import type { Tab } from '../widgets/tab/Tab';
import BrowserBody from './BrowserBody';
import { MaximizedCodeEditor, type MaximizedCodeEditorProps } from './maximizedCodeEditor/MaximizedCodeEditor';
import { type UseBrowserReturnValue } from './useBrowser';

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
  const { t } = useTranslation();
  const tabs: Tab[] = [
    {
      content: (
        <MaximizedCodeEditor
          applyEditor={applyEditor}
          browsers={browsers}
          editorValue={editorValue}
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
      name: header?.title ?? t('browser.code.title'),
      icon: header?.icon ?? IvyIcons.StartProgram
    }
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <BrowserBody activeTab='maxCode' open={open} tabs={tabs} />
      </Dialog>
    </>
  );
};
