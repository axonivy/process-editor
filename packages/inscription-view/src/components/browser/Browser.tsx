import { Button } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAttributeBrowser } from './attribute/AttributeBrowser';
import BrowserBody from './BrowserBody';
import { useCmsBrowser, type CmsOptions } from './cms/CmsBrowser';
import { useConditionBuilder } from './conditionBuilder/useConditionBuilder';
import { useFuncBrowser } from './function/FunctionBrowser';
import { useRoleBrowser, type RoleOptions } from './role/RoleBrowser';
import { useTableColBrowser } from './tableCol/TableColBrowser';
import { useTypeBrowser } from './type/TypeBrowser';
import type { BrowserType, UseBrowserReturnValue } from './useBrowser';

export type BrowserValue = { cursorValue: string; firstLineValue?: string };

type BrowserProps = UseBrowserReturnValue & {
  types: BrowserType[];
  accept: (value: BrowserValue, type: BrowserType) => void;
  location: string;
  cmsOptions?: CmsOptions;
  roleOptions?: RoleOptions;
  initSearchFilter?: () => string;
};

const Browser = ({ open, onOpenChange, types, accept, location, cmsOptions, roleOptions, initSearchFilter }: BrowserProps) => {
  const { t } = useTranslation();
  const [active, setActive] = useState<BrowserType>(types[0] ?? 'attr');
  const [disableApply, setDisableApply] = useState(false);

  const acceptBrowser = () => {
    // eslint-disable-next-line react-hooks/immutability
    accept(allBrowsers.find(browser => browser.id === active)?.accept() ?? { cursorValue: '' }, active);
  };

  const onRowDoubleClick = () => {
    onOpenChange(false);
    acceptBrowser();
  };

  const attrBrowser = useAttributeBrowser(onRowDoubleClick, location);
  const cmsBrowser = useCmsBrowser(onRowDoubleClick, location, setDisableApply, cmsOptions);
  const funcBrowser = useFuncBrowser(onRowDoubleClick);
  const typeBrowser = useTypeBrowser(
    onRowDoubleClick,
    initSearchFilter
      ? initSearchFilter
      : () => {
          return '';
        },
    location
  );
  const tableColBrowser = useTableColBrowser(onRowDoubleClick);
  const roleBrowser = useRoleBrowser(onRowDoubleClick, roleOptions);
  const conditionBuilder = useConditionBuilder();

  const allBrowsers = [conditionBuilder, attrBrowser, cmsBrowser, funcBrowser, typeBrowser, tableColBrowser, roleBrowser];

  const tabs = allBrowsers.filter(browser => types.includes(browser.id));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogTrigger asChild>
          <Button icon={IvyIcons.ListSearch} aria-label={t('common.label.browser')} title={t('common.label.browser')} />
        </DialogTrigger>
        <BrowserBody
          activeTab={active}
          onTabsChange={change => setActive(change as BrowserType)}
          onApply={() => acceptBrowser()}
          open={open}
          tabs={tabs}
          disableApply={disableApply}
        />
      </Dialog>
    </>
  );
};

export default Browser;
