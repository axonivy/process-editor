import type { ErrorThrowData } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { useValidations } from '../../../context/useValidation';
import { classifiedItemInfo } from '../../../utils/event-code-categorie';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import { ScriptArea } from '../../widgets/code-editor/ScriptArea';
import { ScriptInput } from '../../widgets/code-editor/ScriptInput';
import type { ClassifiedItem } from '../common/classification/ClassificationCombobox';
import ClassificationCombobox from '../common/classification/ClassificationCombobox';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { PathFieldset } from '../common/path/PathFieldset';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import { useErrorThrowData } from './useErrorThrowData';

export function useErrorThrowPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useErrorThrowData();
  const compareData = (data: ErrorThrowData) => [data];
  const validations = [...useValidations(['throws']), ...useValidations(['code'])];
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Error',
    name: t('part.error.title'),
    state,
    content: <ErrorThrowPart />,
    icon: IvyIcons.Error
  };
}

const ErrorThrowPart = () => {
  const { t } = useTranslation();
  const { config, defaultConfig, update, updateThrows } = useErrorThrowData();
  const { context } = useEditorContext();
  const errorCodes = [
    ...useMeta('meta/workflow/errorCodes', { context, thrower: true }, []).data.map<ClassifiedItem>(code => {
      return { ...code, value: code.eventCode, info: classifiedItemInfo(code) };
    })
  ];
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <>
      <PathCollapsible label={t('part.error.title')} path='throws' defaultOpen={true}>
        <PathFieldset label={t('part.error.codeToThrow')} path='error'>
          <ClassificationCombobox
            value={config.throws.error}
            onChange={change => updateThrows('error', change)}
            data={errorCodes}
            icon={IvyIcons.Error}
          />
        </PathFieldset>
        <PathFieldset label={t('part.error.cause')} path='cause'>
          <ScriptInput
            value={config.throws.cause}
            onChange={change => updateThrows('cause', change)}
            type={IVY_SCRIPT_TYPES.BPM_ERROR}
            browsers={['attr', 'func', 'type']}
          />
        </PathFieldset>
      </PathCollapsible>
      <PathCollapsible label={t('label.code')} path='code' controls={[maximizeCode]} defaultOpen={config.code !== defaultConfig.code}>
        <ValidationFieldset>
          <ScriptArea
            maximizeState={maximizeState}
            value={config.code}
            onChange={change => update('code', change)}
            browsers={['attr', 'func', 'type', 'cms']}
          />
        </ValidationFieldset>
      </PathCollapsible>
    </>
  );
};
