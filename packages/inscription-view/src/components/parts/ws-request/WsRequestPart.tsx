import type { WsRequestData } from '@axonivy/process-editor-inscription-protocol';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import { useWsRequestData } from './useWsRequestData';
import { WsClientSelect } from './WsClientSelect';
import { WsPortSelect } from './WsPortSelect';
import { WsOperationSelect } from './WsOperationSelect';
import { WsProperties } from './WsProperties';
import { WsMapping } from './WsMapping';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { useValidations } from '../../../context/useValidation';
import { useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

export function useWsRequestPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useWsRequestData();
  const validations = [...useValidations(['clientId']), ...useValidations(['operation']), ...useValidations(['properties'])];
  const compareData = (data: WsRequestData) => [data.clientId, data.operation, data.properties];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Request',
    name: t('part.ws.request'),
    state: state,
    content: <WsRequestPart />,
    icon: IvyIcons.RestClient
  };
}

const WsRequestPart = () => {
  const { t } = useTranslation();
  return (
    <>
      <ValidationCollapsible label={t('part.ws.title')} defaultOpen={true}>
        <WsClientSelect />
        <WsPortSelect />
        <WsOperationSelect />
      </ValidationCollapsible>
      <WsProperties />
      <WsMapping />
    </>
  );
};
