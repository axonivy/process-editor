import type { RequestData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import Checkbox from '../../widgets/checkbox/Checkbox';
import StartCustomFieldTable from '../common/customfield/StartCustomFieldTable';
import Information from '../common/info/Information';
import { Permission } from '../common/permission/Permission';
import { useRequestData } from './useRequestData';

export function useRequestPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useRequestData();
  const requestVal = useValidations(['request']);
  const permissionVal = useValidations(['permission']);
  const compareData = (data: RequestData) => [data];
  const state = usePartState(compareData(defaultConfig), compareData(config), [...requestVal, ...permissionVal]);
  return {
    id: 'Request',
    name: t('part.request.title'),
    state: state,
    content: <RequestPart />,
    icon: IvyIcons.RestClient
  };
}

const RequestPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateRequest, updatePermission } = useRequestData();
  return (
    <>
      <Checkbox
        value={config.request.isHttpRequestable}
        onChange={change => updateRequest('isHttpRequestable', change)}
        label={t('part.request.startPerHttp')}
        style={{ paddingInline: 'var(--size-2)' }}
      />
      {config.request.isHttpRequestable && (
        <>
          <PathContext path='request'>
            {config.request.linkName}
            <Checkbox
              value={config.request.isVisibleOnStartList}
              onChange={change => updateRequest('isVisibleOnStartList', change)}
              label={t('part.request.showOnStartList')}
              style={{ paddingInline: 'var(--size-2)' }}
            />
            <Information config={config.request} defaultConfig={defaultConfig.request} update={updateRequest} />
            <StartCustomFieldTable data={config.request.customFields} onChange={change => updateRequest('customFields', change)} />
          </PathContext>
          <Permission
            config={config.permission}
            defaultConfig={defaultConfig.permission}
            updatePermission={updatePermission}
            anonymousFieldActive={true}
          />
        </>
      )}
    </>
  );
};
