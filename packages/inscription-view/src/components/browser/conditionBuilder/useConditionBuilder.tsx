import { ConditionBuilder } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InputWithBrowser from '../../widgets/input/InputWithBrowser';
import type { BrowserValue, UseBrowserImplReturnValue } from '../useBrowser';
import { generateConditionString, logicOperators, operators } from './conditionBuilderData';

export const CONDITION_BUILDER_ID = 'condition' as const;

export const useConditionBuilder = (): UseBrowserImplReturnValue => {
  const { t } = useTranslation();
  const [value, setValue] = useState<BrowserValue>({ value: '' });
  return {
    id: CONDITION_BUILDER_ID,
    name: t('browser.condition.title'),
    content: <ConditionBrowser value={value.value} onChange={setValue} />,
    accept: () => value,
    icon: IvyIcons.Process
  };
};

type ConditionBrowserProps = {
  value: string;
  onChange: (value: BrowserValue) => void;
};

const ConditionBrowser = ({ value, onChange }: ConditionBrowserProps) => {
  const { t } = useTranslation();
  return (
    <>
      <ConditionBuilder
        onChange={change => onChange({ value: change })}
        generateConditionString={generateConditionString}
        logicOperators={logicOperators}
        operators={operators}
        argumentInput={(value, onChange) => <InputWithBrowser value={value} onChange={onChange} browsers={['attr']} style={{ flex: 1 }} />}
      />
      <pre className='browser-helptext'>
        <b>{t('browser.condition.info')}</b>
        <code>{value}</code>
      </pre>
    </>
  );
};
