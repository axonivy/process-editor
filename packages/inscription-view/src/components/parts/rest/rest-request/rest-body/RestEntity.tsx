import { EMPTY_VAR_INFO } from '@axonivy/process-editor-inscription-protocol';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../../../context/useEditorContext';
import { useMeta } from '../../../../../context/useMeta';
import { PathContext } from '../../../../../context/usePath';
import useMaximizedCodeEditor from '../../../../browser/useMaximizedCodeEditor';
import { ScriptArea } from '../../../../widgets/code-editor/ScriptArea';
import { MappingField } from '../../../common/mapping-tree/MappingPart';
import { PathFieldset } from '../../../common/path/PathFieldset';
import { RestEntityTypeCombobox, useShowRestEntityTypeCombo } from '../../RestEntityTypeCombobox';
import { useRestRequestData } from '../../useRestRequestData';
import { useRestEntityTypeMeta, useRestResourceMeta } from '../../useRestResourceMeta';

const useShowEntityTypeCombo = (types: string[], currentType: string) => {
  const resource = useRestResourceMeta();
  return useShowRestEntityTypeCombo(types, currentType, resource?.method?.inBody);
};

export const RestEntity = () => {
  const { t } = useTranslation();
  const { config, updateEntity } = useRestRequestData();
  const { context } = useEditorContext();
  const variableInfo = useMeta('meta/rest/entityInfo', { context, fullQualifiedName: config.body.entity.type }, EMPTY_VAR_INFO).data;
  const entityTypes = useRestEntityTypeMeta('entity');
  const showEntityType = useShowEntityTypeCombo(entityTypes, config.body.entity.type);
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();
  return (
    <PathContext path='entity'>
      {showEntityType && (
        <PathFieldset label={t('part.rest.entityType')} path='type'>
          <RestEntityTypeCombobox value={config.body.entity.type} onChange={change => updateEntity('type', change)} items={entityTypes} />
        </PathFieldset>
      )}
      <MappingField
        browsers={['attr', 'func', 'type']}
        data={config.body.entity.map}
        onChange={change => updateEntity('map', change)}
        variableInfo={variableInfo}
      />
      <PathFieldset label={t('label.code')} path='code' controls={[maximizeCode]}>
        <ScriptArea
          maximizeState={maximizeState}
          value={config.body.entity.code}
          onChange={change => updateEntity('code', change)}
          browsers={['attr', 'func', 'type']}
        />
      </PathFieldset>
    </PathContext>
  );
};
