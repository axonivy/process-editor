import type { RestResponseData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import { ScriptArea } from '../../widgets/code-editor/ScriptArea';
import MappingPart from '../common/mapping-tree/MappingPart';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { RestEntityTypeCombobox, useShowRestEntityTypeCombo } from './RestEntityTypeCombobox';
import { useRestOutputData } from './useRestOutputData';
import { useRestEntityTypeMeta, useRestResourceMeta } from './useRestResourceMeta';

export function useRestOutputPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useRestOutputData();
  const validations = useValidations(['response']);
  const filteredOutputValidations = validations.filter(item => item.path.startsWith('response.entity'));
  const compareData = (data: RestResponseData) => [data.response.entity];
  const state = usePartState(compareData(defaultConfig), compareData(config), filteredOutputValidations);
  return {
    id: 'Output',
    name: t('label.output'),
    state: state,
    content: <RestOutputPart />,
    icon: IvyIcons.Output
  };
}

const useShowResultTypeCombo = (types: string[], currentType: string) => {
  const resource = useRestResourceMeta();
  return useShowRestEntityTypeCombo(types, currentType, resource?.method?.outResult);
};

const RestOutputPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateEntity } = useRestOutputData();
  const { elementContext: context } = useEditorContext();
  const { data: variableInfo } = useMeta('meta/scripting/out', { context, location: 'response' }, { variables: [], types: {} });
  const resultTypes = useRestEntityTypeMeta('result');
  const showResultType = useShowResultTypeCombo(resultTypes, config.response.entity.type);
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();
  return (
    <PathContext path='response'>
      <PathContext path='entity'>
        {showResultType && (
          <PathCollapsible label={t('part.rest.resultType')} path='type' defaultOpen={true}>
            <ValidationFieldset label={t('part.rest.readBodyType')}>
              <RestEntityTypeCombobox
                value={config.response.entity.type}
                onChange={change => updateEntity('type', change)}
                items={resultTypes}
              />
            </ValidationFieldset>
          </PathCollapsible>
        )}
        <MappingPart
          data={config.response.entity.map}
          variableInfo={variableInfo}
          browsers={['attr', 'func', 'type']}
          onChange={change => updateEntity('map', change)}
          defaultData={defaultConfig.response.entity.map}
          defaultOpen={true}
        />
        <PathCollapsible
          label={t('label.code')}
          path='code'
          controls={[maximizeCode]}
          defaultOpen={config.response.entity.code !== defaultConfig.response.entity.code}
        >
          <ValidationFieldset>
            <ScriptArea
              maximizeState={maximizeState}
              value={config.response.entity.code}
              onChange={change => updateEntity('code', change)}
              browsers={['attr', 'func', 'type']}
            />
          </ValidationFieldset>
        </PathCollapsible>
      </PathContext>
    </PathContext>
  );
};
