import type { Type } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useAction } from '../../../context/useAction';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import type { Consumer } from '../../../types/lambda';
import type { ComboboxItem } from '../../widgets/combobox/Combobox';
import Combobox from '../../widgets/combobox/Combobox';
import type { FieldsetControl } from '../../widgets/fieldset/fieldset-control';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';

type JavaClassSelectorProps = {
  javaClass: string;
  onChange: Consumer<string>;
  type: Type;
};

type JavaClassItem = ComboboxItem & {
  label: string;
  package: string;
};

const JavaClassSelector = ({ javaClass, onChange, type }: JavaClassSelectorProps) => {
  const { t } = useTranslation();
  const { context } = useEditorContext();
  const javaClassItems = useMeta('meta/program/types', { type: type, context }, []).data.map<JavaClassItem>(javaClass => ({
    value: javaClass.fullQualifiedName,
    label: javaClass.name,
    package: javaClass.packageName
  }));

  const newAction = useAction('newProgram');
  const openAction = useAction('openProgram');
  const openJavaClassConfig: FieldsetControl = {
    label: t('part.program.javaClassOpen'),
    icon: IvyIcons.GoToSource,
    action: () => openAction(javaClass)
  };
  const createJavaClass: FieldsetControl = { label: t('part.program.javaClassCreate'), icon: IvyIcons.Plus, action: () => newAction() };

  const comboboxItem = (item: JavaClassItem) => {
    const tooltip = `${item.value}`;
    return (
      <>
        <div title={tooltip} aria-label={tooltip}>
          <span>{item.label}</span>
          <span className='combobox-menu-entry-additional'>{` - ${item.package}`}</span>
        </div>
      </>
    );
  };

  return (
    <PathCollapsible
      label={t('part.program.javaClass')}
      path='javaClass'
      controls={[openJavaClassConfig, createJavaClass]}
      defaultOpen={true}
    >
      <ValidationFieldset>
        <Combobox value={javaClass} onChange={item => onChange(item)} items={javaClassItems} comboboxItem={comboboxItem} />
      </ValidationFieldset>
    </PathCollapsible>
  );
};

export default JavaClassSelector;
