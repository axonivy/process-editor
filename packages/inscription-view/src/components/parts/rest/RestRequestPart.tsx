import type { HttpMethod, RestRequestData } from '@axonivy/process-editor-inscription-protocol';
import { Field, Label, Switch } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { useOpenApi } from '../../../context/useOpenApi';
import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { RestBody } from './rest-request/rest-body/RestBody';
import { RestJaxRsCode } from './rest-request/rest-body/RestJaxRsCode';
import { RestClientSelect } from './rest-request/rest-target/RestClientSelect';
import { RestHeaders } from './rest-request/rest-target/RestHeaders';
import { RestMethodSelect } from './rest-request/rest-target/RestMethodSelect';
import { RestParameters } from './rest-request/rest-target/RestParameters';
import { RestProperties } from './rest-request/rest-target/RestProperties';
import { RestTargetUrl } from './rest-request/rest-target/RestTargetUrl';
import { useRestRequestData } from './useRestRequestData';

export function useRestRequestPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useRestRequestData();
  const { context } = useEditorContext();
  const resources = useMeta('meta/rest/resources', { context, clientId: config.target.clientId }, []).data;
  const validations = [
    ...useValidations(['method']),
    ...useValidations(['target']),
    ...useValidations(['body']),
    ...useValidations(['code'])
  ];
  const compareData = (data: RestRequestData) => [data.body, data.code, data.method, data.target];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Request',
    name: t('label.request'),
    state: state,
    content: <RestRequestPart />,
    control: resources.length === 0 ? undefined : <OpenApiSwitch />,
    icon: IvyIcons.RestClient
  };
}

const RestRequestPart = () => {
  const { t } = useTranslation();
  const { config } = useRestRequestData();

  const bodyPart = (method: HttpMethod) => {
    switch (method) {
      case 'POST':
      case 'PUT':
      case 'PATCH':
        return <RestBody />;
      case 'JAX_RS':
        return <RestJaxRsCode />;
      default:
        return <></>;
    }
  };

  return (
    <>
      <PathContext path='target'>
        <ValidationCollapsible label={t('part.rest.service')} defaultOpen={true}>
          <RestTargetUrl />
          <RestClientSelect />
          <RestMethodSelect />
        </ValidationCollapsible>
        <RestParameters />
        <RestHeaders />
        <RestProperties />
      </PathContext>
      {bodyPart(config.method)}
    </>
  );
};

const OpenApiSwitch = () => {
  const { t } = useTranslation();
  const { openApi, setOpenApi } = useOpenApi();

  return (
    <Field direction='row' alignItems='center' gap={2}>
      <Label style={{ fontWeight: 'normal' }}>{t('part.rest.openApi')}</Label>
      <Switch checked={openApi} onCheckedChange={setOpenApi} />
    </Field>
  );
};
