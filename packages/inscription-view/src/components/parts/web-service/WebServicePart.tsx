import type { WebserviceStartData } from '@axonivy/process-editor-inscription-protocol';
import { usePartState, type PartProps } from '../../../components/editors/part/usePart';
import { useWebServiceData } from './useWebServiceData';
import { Exception } from './Exception';
import { PID } from '../../../utils/pid';
import { Permission } from '../common/permission/Permission';
import { Message } from '@axonivy/ui-components';
import { useValidations } from '../../../context/useValidation';
import { useEditorContext } from '../../../context/useEditorContext';
import { Trans, useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

export function useWebServicePart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useWebServiceData();
  const compareData = (data: WebserviceStartData) => [data];
  const validation = [...useValidations(['permission']), ...useValidations(['exception'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  return {
    id: 'Web Service',
    name: t('part.ws.title'),
    state,
    content: <WebServicePart />,
    icon: IvyIcons.WsStart
  };
}

const WebServicePart = () => {
  const { elementContext, navigateTo } = useEditorContext();
  const { config, defaultConfig, updatePermission } = useWebServiceData();
  const navigateToProcess = () => navigateTo(PID.processId(elementContext.pid));
  return (
    <>
      <Message variant='info'>
        <Trans i18nKey='part.ws.authMessage' components={{ a: <a href='#' onClick={navigateToProcess} /> }}>
          Web service authentication on the <a>process</a>
        </Trans>
      </Message>
      <Permission
        anonymousFieldActive={false}
        config={config.permission}
        defaultConfig={defaultConfig.permission}
        updatePermission={updatePermission}
      />
      <Exception />
    </>
  );
};
