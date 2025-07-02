import type { OutputData } from '@axonivy/process-editor-inscription-protocol';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import { useOutputData } from './useOutputData';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { useValidations } from '../../../context/useValidation';
import type { BrowserType } from '../../browser/useBrowser';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathContext } from '../../../context/usePath';
import MappingPart from '../common/mapping-tree/MappingPart';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { ScriptArea } from '../../widgets/code-editor/ScriptArea';
import Checkbox from '../../widgets/checkbox/Checkbox';
import { useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

type OutputPartOptions = {
  showSudo?: boolean;
  additionalBrowsers?: BrowserType[];
  defaultOpenCode?: boolean;
};

export function useOutputPart(options?: OutputPartOptions): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useOutputData();
  const compareData = (data: OutputData) => [data];
  const validations = [...useValidations(['output']), ...useValidations(['map'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Output',
    name: t('part.output.title'),
    state,
    content: <OutputPart {...options} />,
    icon: IvyIcons.Output
  };
}

const OutputPart = ({ additionalBrowsers, showSudo, defaultOpenCode }: OutputPartOptions) => {
  const { t } = useTranslation();
  const { config, defaultConfig, update, updateSudo } = useOutputData();

  const { elementContext: context } = useEditorContext();
  const { data: variableInfo } = useMeta('meta/scripting/out', { context, location: 'output' }, { variables: [], types: {} });

  const browsers: BrowserType[] = ['attr', 'func', 'type', ...(additionalBrowsers ?? [])];

  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();
  return (
    <PathContext path='output'>
      <MappingPart
        data={config.output.map}
        variableInfo={variableInfo}
        onChange={change => update('map', change)}
        browsers={browsers}
        defaultData={defaultConfig.output.map}
        defaultOpen={defaultOpenCode ? undefined : true}
      />
      <PathCollapsible
        label={t('label.code')}
        path='code'
        controls={[maximizeCode]}
        defaultOpen={defaultOpenCode ?? (config.output.code !== defaultConfig.output.code || config.sudo !== defaultConfig.sudo)}
      >
        <ValidationFieldset>
          <ScriptArea
            maximizeState={maximizeState}
            value={config.output.code}
            onChange={change => update('code', change)}
            browsers={browsers}
          />
        </ValidationFieldset>
        {showSudo && <Checkbox label={t('part.output.disablePermission')} value={config.sudo} onChange={updateSudo} />}
      </PathCollapsible>
    </PathContext>
  );
};
