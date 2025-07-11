import type { InputType } from '@axonivy/process-editor-inscription-protocol';
import { REST_INPUT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useTranslation } from 'react-i18next';
import type { RadioItemProps } from '../../../../../components/widgets/radio/Radio';
import Radio from '../../../../../components/widgets/radio/Radio';
import { useOpenApi } from '../../../../../context/useOpenApi';
import { deepEqual } from '../../../../../utils/equals';
import { PathCollapsible } from '../../../common/path/PathCollapsible';
import { isFormMedia } from '../../known-types';
import { useRestRequestData } from '../../useRestRequestData';
import { useRestResourceMeta } from '../../useRestResourceMeta';
import { RestBodyRaw } from './RestBodyRaw';
import { RestContentType } from './RestContentType';
import { RestEntity } from './RestEntity';
import { RestForm } from './RestForm';

export const useBodyTypes = (currentType: InputType): RadioItemProps<InputType>[] => {
  const { openApi } = useOpenApi();
  const resource = useRestResourceMeta();
  let types = Object.entries(REST_INPUT_TYPES);
  if (openApi && resource.method) {
    const isFormSelected = currentType === 'FORM';
    const isFormSpec = isFormMedia(resource.method?.inBody?.media);
    if (isFormSelected && isFormSpec) {
      // no other type is valid
      return [];
    }
    if (!isFormSelected) {
      types = types.filter(entry => entry[1] !== 'Form');
    }
  }
  return types.map(([key, value]) => ({ label: value, value: key as InputType }));
};

export const RestBody = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateBody } = useRestRequestData();
  const radioItems = useBodyTypes(config.body.type);

  const bodyType = (type: InputType) => {
    switch (type) {
      case 'ENTITY':
        return <RestEntity />;
      case 'FORM':
        return <RestForm />;
      case 'RAW':
        return <RestBodyRaw />;
    }
  };

  return (
    <PathCollapsible label={t('part.rest.body')} path='body' defaultOpen={!deepEqual(config.body, defaultConfig.body)}>
      {radioItems.length > 0 && (
        <Radio value={config.body.type} onChange={change => updateBody('type', change)} items={radioItems} orientation='horizontal' />
      )}
      {bodyType(config.body.type)}
      <RestContentType />
    </PathCollapsible>
  );
};
