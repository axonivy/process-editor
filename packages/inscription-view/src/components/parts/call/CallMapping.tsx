import type { ValidationResult, VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { ScriptArea } from '../../widgets/code-editor/ScriptArea';
import MappingPart from '../common/mapping-tree/MappingPart';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { useCallData } from './useCallData';

export function useCallPartValidation(): ValidationResult[] {
  return useValidations(['call']);
}

const CallMapping = ({ variableInfo }: { variableInfo: VariableInfo }) => {
  const { t } = useTranslation();
  const { config, defaultConfig, update } = useCallData();
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <PathContext path='call'>
      <MappingPart
        data={config.call.map}
        defaultData={defaultConfig.call.map}
        variableInfo={variableInfo}
        onChange={change => update('map', change)}
        browsers={['attr', 'func', 'type']}
        defaultOpen={true}
      />
      <PathCollapsible
        label={t('label.code')}
        path='code'
        controls={[maximizeCode]}
        defaultOpen={config.call.code !== defaultConfig.call.code}
      >
        <ValidationFieldset>
          <ScriptArea
            maximizeState={maximizeState}
            value={config.call.code}
            onChange={change => update('code', change)}
            browsers={['attr', 'func', 'type']}
          />
        </ValidationFieldset>
      </PathCollapsible>
    </PathContext>
  );
};

export default memo(CallMapping);
