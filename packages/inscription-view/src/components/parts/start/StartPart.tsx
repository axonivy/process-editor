import { usePartState, type PartProps } from '../../editors/part/usePart';
import { useStartData } from './useStartData';
import type { StartData } from '@axonivy/process-editor-inscription-protocol';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { useValidations } from '../../../context/useValidation';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { Input } from '../../widgets/input/Input';
import { PathContext } from '../../../context/usePath';
import ParameterTable from '../common/parameter/ParameterTable';
import MappingPart from '../common/mapping-tree/MappingPart';
import { ScriptArea } from '../../widgets/code-editor/ScriptArea';
import { useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

type StartPartProps = { hideParamDesc?: boolean; synchParams?: boolean; signatureDefaultOpen?: boolean };

export const useStartPartValidation = () => {
  const signarture = useValidations(['signature']);
  const input = useValidations(['input']);
  return [...signarture, ...input];
};

export function useStartPart(props?: StartPartProps): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useStartData();
  const validations = useStartPartValidation();
  const compareData = (data: StartData) => [data.signature, data.input];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Start',
    name: t('part.start.title'),
    state,
    content: <StartPart {...props} />,
    icon: IvyIcons.Play
  };
}

const StartPart = ({ hideParamDesc, synchParams, signatureDefaultOpen }: StartPartProps) => {
  const { t } = useTranslation();
  const { config, defaultConfig, updateSignature, update } = useStartData(synchParams);
  const { elementContext: context } = useEditorContext();
  const { data: variableInfo } = useMeta('meta/scripting/out', { context, location: 'input' }, { variables: [], types: {} });
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();
  return (
    <>
      <PathCollapsible
        label={t('part.start.signature')}
        path='signature'
        defaultOpen={signatureDefaultOpen ?? config.signature !== defaultConfig.signature}
      >
        <ValidationFieldset>
          <Input value={config.signature} onChange={change => updateSignature(change)} />
        </ValidationFieldset>
      </PathCollapsible>
      <PathContext path='input'>
        <ParameterTable
          label={t('part.start.inputParamters')}
          data={config.input.params}
          onChange={change => update('params', change)}
          hideDesc={hideParamDesc}
        />
        <MappingPart
          data={config.input.map}
          defaultData={defaultConfig.input.map}
          variableInfo={variableInfo}
          onChange={change => update('map', change)}
          browsers={['attr', 'func', 'type']}
          defaultOpen={true}
        />
        <PathCollapsible
          label={t('label.code')}
          path='code'
          controls={[maximizeCode]}
          defaultOpen={config.input.code !== defaultConfig.input.code}
        >
          <ValidationFieldset>
            <ScriptArea
              maximizeState={maximizeState}
              value={config.input.code}
              onChange={change => update('code', change)}
              browsers={['attr', 'func', 'type']}
            />
          </ValidationFieldset>
        </PathCollapsible>
      </PathContext>
    </>
  );
};
