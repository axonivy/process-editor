import { InputGroup } from '@axonivy/ui-components';
import { usePath } from '../../../context/usePath';
import Browser from '../../browser/Browser';
import type { CmsTypeFilter } from '../../browser/cms/CmsBrowser';
import { useBrowser, type BrowserType, type BrowserValue } from '../../browser/useBrowser';
import { Input, type InputProps } from './Input';

type InputWithBrowserProps = InputProps & {
  browsers: BrowserType[];
  typeFilter?: CmsTypeFilter;
  modifyAction?: (value: string) => string;
};

const InputWithBrowser = ({ onChange, browsers, typeFilter, modifyAction, ...props }: InputWithBrowserProps) => {
  const browser = useBrowser();
  const path = usePath();

  return (
    <InputGroup style={{ flex: '1' }}>
      <Input onChange={onChange} {...props} />
      <Browser
        {...browser}
        types={browsers}
        cmsOptions={{ noApiCall: true, typeFilter: typeFilter }}
        accept={(change: BrowserValue) => onChange(modifyAction ? modifyAction(change.value) : change.value)}
        location={path}
      />
    </InputGroup>
  );
};

export default InputWithBrowser;
