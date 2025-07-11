import type { InputType } from '@axonivy/process-editor-inscription-protocol';
import { useTranslation } from 'react-i18next';
import { useMeta } from '../../../../../context/useMeta';
import { useOpenApi } from '../../../../../context/useOpenApi';
import type { ComboboxItem } from '../../../../widgets/combobox/Combobox';
import Combobox from '../../../../widgets/combobox/Combobox';
import { PathFieldset } from '../../../common/path/PathFieldset';
import { useRestRequestData } from '../../useRestRequestData';
import { useRestResourceMeta } from '../../useRestResourceMeta';

const useShowContentTypeCombo = (mode: InputType) => {
  const { openApi } = useOpenApi();
  const resource = useRestResourceMeta();
  return !openApi || !resource.method || mode === 'RAW';
};

export const RestContentType = () => {
  const { t } = useTranslation();
  const { config, updateBody } = useRestRequestData();
  const knownContentTypes = useMeta('meta/rest/contentTypes', { forBody: true }, []).data.map<ComboboxItem>(type => ({ value: type }));
  const showContentType = useShowContentTypeCombo(config.body.type);
  return (
    <>
      {showContentType && (
        <PathFieldset label={t('part.rest.contentType')} path='mediaType'>
          <Combobox value={config.body.mediaType} onChange={change => updateBody('mediaType', change)} items={knownContentTypes} />
        </PathFieldset>
      )}
    </>
  );
};
