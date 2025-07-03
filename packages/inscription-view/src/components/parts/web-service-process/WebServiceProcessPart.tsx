import type { WebServiceProcessData, WsAuth } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { usePartState, type PartProps } from '../../../components/editors/part/usePart';
import { useWebServiceProcessData } from './useWebServiceProcessData';
import { useValidations } from '../../../context/useValidation';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { PathFieldset } from '../common/path/PathFieldset';
import { Input } from '../../widgets/input/Input';
import Radio, { type RadioItemProps } from '../../widgets/radio/Radio';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { IvyIcons } from '@axonivy/ui-icons';

export function useWebServiceProcessPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useWebServiceProcessData();
  const compareData = (data: WebServiceProcessData) => [data.wsAuth, data.wsTypeName];
  const validation = [...useValidations(['wsAuth']), ...useValidations(['wsTypeName'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  return {
    id: 'Web Service Process',
    name: t('part.wsprocess.title'),
    state,
    content: <WebServiceProcessPart />,
    icon: IvyIcons.WebServiceProcess
  };
}

const useAuthTypes = () => {
  const { t } = useTranslation();
  return useMemo<Array<RadioItemProps<WsAuth>>>(
    () => [
      { label: t('part.wsprocess.auth.none'), value: 'NONE' },
      { label: t('part.wsprocess.auth.wsSecurity'), value: 'WS_SECURITY' },
      { label: t('part.wsprocess.auth.httpBasic'), value: 'HTTP_BASIC' }
    ],
    [t]
  );
};

const WebServiceProcessPart = () => {
  const { t } = useTranslation();
  const { config, update } = useWebServiceProcessData();
  const items = useAuthTypes();
  return (
    <ValidationCollapsible label={t('label.process')} defaultOpen={true}>
      <PathFieldset label={t('part.wsprocess.qualifiedName')} path='wsTypeName'>
        <Input value={config.wsTypeName} onChange={change => update('wsTypeName', change)} type={IVY_SCRIPT_TYPES.STRING} />
      </PathFieldset>
      <PathFieldset label={t('part.wsprocess.authentication')} path='wsAuth'>
        <Radio value={config.wsAuth} onChange={change => update('wsAuth', change as WsAuth)} items={items} orientation='horizontal' />
      </PathFieldset>
    </ValidationCollapsible>
  );
};
