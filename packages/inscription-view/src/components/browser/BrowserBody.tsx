import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { DialogClose, DialogContent, DialogPortal, DialogTitle } from '@radix-ui/react-dialog';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../context/useEditorContext';
import { TabContent, TabList, TabRoot, type Tab } from '../widgets/tab/Tab';
import './BrowserBody.css';

interface ReusableBrowserDialogProps {
  open: boolean;
  tabs: Tab[];
  activeTab: string;
  onTabsChange?: (change: string) => void;
  onApply?: () => void;
  disableApply?: boolean;
}

const focusFirstInput = () => {
  document.querySelector<HTMLElement>('.browser-content .ui-input')?.focus();
};

const BrowserBody = ({ open, tabs, activeTab, onTabsChange, onApply, disableApply }: ReusableBrowserDialogProps) => {
  const { t } = useTranslation();
  const { editorRef } = useEditorContext();
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalContainer(editorRef.current);
  }, [editorRef]);

  return (
    <DialogPortal container={portalContainer}>
      <DialogContent
        className={`browser-dialog ${!open ? 'browser-content-exit' : ''}`}
        onInteractOutside={e => {
          e.preventDefault();
        }}
        onOpenAutoFocus={e => e.preventDefault()}
        ref={dialog => {
          dialog?.addEventListener('animationend', () => focusFirstInput());
          return () => dialog?.removeEventListener('animationend', () => focusFirstInput());
        }}
      >
        <div className='browser-content'>
          <TabRoot tabs={tabs} value={activeTab} onChange={onTabsChange}>
            <DialogTitle className='browser-title'>
              <TabList tabs={tabs} />
            </DialogTitle>

            <TabContent tabs={tabs} />
          </TabRoot>
          <Flex alignItems='center' justifyContent='flex-end' gap={2}>
            <DialogClose asChild>
              <Button aria-label={t('common.label.cancel')} variant='outline' size='large'>
                {t('common.label.cancel')}
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                aria-label={t('common.label.apply')}
                onClick={onApply}
                icon={IvyIcons.Check}
                size='large'
                variant='primary'
                disabled={disableApply}
              >
                {t('common.label.apply')}
              </Button>
            </DialogClose>
          </Flex>
        </div>
      </DialogContent>
    </DialogPortal>
  );
};

export default BrowserBody;
