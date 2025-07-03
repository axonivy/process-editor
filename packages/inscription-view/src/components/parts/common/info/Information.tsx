import type { DataUpdater } from '../../../../types/lambda';
import { PathFieldset } from '../path/PathFieldset';
import type { SchemaKeys, SchemaPath, WorkflowType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import ClassificationCombobox, { type ClassifiedItem } from '../classification/ClassificationCombobox';
import { classifiedItemInfo } from '../../../../utils/event-code-categorie';
import { ValidationCollapsible } from '../path/validation/ValidationCollapsible';
import { useEditorContext } from '../../../../context/useEditorContext';
import { usePath } from '../../../../context/usePath';
import { useAction } from '../../../../context/useAction';
import { useMeta } from '../../../../context/useMeta';
import { MacroInput } from '../../../widgets/code-editor/MacroInput';
import { MacroArea } from '../../../widgets/code-editor/MacroArea';
import { useTranslation } from 'react-i18next';

type InformationConfig = {
  name: string;
  description: string;
  category: string;
};

type InformationProps<T> = {
  config: InformationConfig;
  defaultConfig: InformationConfig;
  update: DataUpdater<T>;
};

const toWorkflowType = (path: '' | SchemaPath | SchemaKeys): WorkflowType => {
  const location = path.toLowerCase();
  if (location.includes('request') || location.includes('start')) {
    return 'START';
  }
  if (location.includes('case')) {
    return 'CASE';
  }
  if (location.includes('task')) {
    return 'TASK';
  }
  return '' as WorkflowType;
};

const Information = <T extends InformationConfig>({ config, update }: InformationProps<T>) => {
  const { t } = useTranslation();
  const { context } = useEditorContext();
  const path = usePath();
  const openAction = useAction('openOrCreateCmsCategory');

  const categories = [
    { value: '', label: t('part.category.empty'), info: t('part.category.emptyDesc') },
    ...useMeta('meta/workflow/categoryPaths', { context, type: toWorkflowType(path) }, []).data.map<ClassifiedItem>(categroy => {
      return { ...categroy, value: categroy.path, info: classifiedItemInfo(categroy) };
    })
  ];

  return (
    <ValidationCollapsible label={t('part.general.nameAndDescription')} defaultOpen={true} paths={['name', 'description', 'category']}>
      <PathFieldset label={t('common.label.name')} path='name'>
        <MacroInput value={config.name} browsers={['attr', 'func', 'cms']} onChange={change => update('name', change)} />
      </PathFieldset>
      <PathFieldset label={t('common.label.description')} path='description'>
        <MacroArea value={config.description} browsers={['attr', 'func', 'cms']} onChange={change => update('description', change)} />
      </PathFieldset>
      <PathFieldset
        label={t('common.label.category')}
        path='category'
        controls={[{ label: t('label.openCMS'), icon: IvyIcons.Cms, action: () => openAction('/Categories/' + config.category + '/name') }]}
      >
        <ClassificationCombobox
          value={config.category}
          onChange={change => update('category', change)}
          data={categories}
          icon={IvyIcons.Label}
          withBrowser={true}
        />
      </PathFieldset>
    </ValidationCollapsible>
  );
};

export default Information;
