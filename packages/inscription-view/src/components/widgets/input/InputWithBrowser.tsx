import { Input, type InputProps } from './Input';
import type { BrowserValue } from '../../browser/Browser';
import type { CmsTypeFilter } from '../../browser/cms/CmsBrowser';
import { InputGroup } from '@axonivy/ui-components';
import { useBrowser, type BrowserType } from '../../browser/useBrowser';
import { usePath } from '../../../context/usePath';
import Browser from '../../browser/Browser';

type InputWithBrowserProps = InputProps & {
  browsers: BrowserType[];
  typeFilter?: CmsTypeFilter;
};

const InputWithBrowser = ({ onChange, browsers, typeFilter, ...props }: InputWithBrowserProps) => {
  const browser = useBrowser();
  const path = usePath();

  return (
    <InputGroup style={{ flex: '1' }}>
      <Input onChange={onChange} {...props} />
      <Browser
        {...browser}
        types={browsers}
        cmsOptions={{ noApiCall: true, typeFilter: typeFilter }}
        accept={(change: BrowserValue) => onChange(change.cursorValue)}
        location={path}
      />
    </InputGroup>
  );
};

export default InputWithBrowser;
