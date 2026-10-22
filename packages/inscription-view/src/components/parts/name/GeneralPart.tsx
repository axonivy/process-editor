import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import Collapsible from '../../widgets/collapsible/Collapsible';
import Fieldset from '../../widgets/fieldset/Fieldset';
import Textarea from '../../widgets/input/Textarea';
import Tags from '../../widgets/tag/Tags';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { ValidationFieldset } from '../common/path/validation/ValidationFieldset';
import DocumentTable from './document/DocumentTable';
import { useGeneralData } from './useGeneralData';

export function useGeneralPart(options?: { hideTags?: boolean; disableName?: boolean }): PartProps {
  const { t } = useTranslation();
  const { data } = useGeneralData();
  const currentData = [data.name, data.description, data.docs, data.tags];
  const state = usePartState(['', '', [], []], currentData, []);
  return {
    id: 'General',
    name: t('part.general.title'),
    state,
    content: <GeneralPart hideTags={options?.hideTags} disableName={options?.disableName} />,
    icon: IvyIcons.InfoCircle
  };
}

const GeneralPart = ({ hideTags, disableName }: { hideTags?: boolean; disableName?: boolean }) => {
  const { t } = useTranslation();
  const { data, update } = useGeneralData();

  const { elementContext } = useEditorContext();
  const dataTags = useMeta('meta/workflow/tags', elementContext, []).data;

  return (
    <>
      <PathCollapsible label={t('part.general.nameAndDescription')} path='name' defaultOpen={true}>
        <ValidationFieldset label={t('part.general.displayName')}>
          <Textarea maxRows={3} disabled={!!disableName} value={data.name} onChange={change => update('name', change)} />
        </ValidationFieldset>
        <Fieldset label={t('common.label.description')}>
          <Textarea maxRows={10} value={data.description} onChange={change => update('description', change)} />
        </Fieldset>
      </PathCollapsible>

      <DocumentTable data={data.docs} onChange={change => update('docs', change)} />

      {!hideTags && (
        <Collapsible label={t('part.general.tags')} defaultOpen={data.tags !== undefined && data.tags.length > 0}>
          <Tags
            tags={data.tags ?? []}
            availableTags={dataTags}
            customValues={true}
            onChange={change => update('tags', change)}
            allowSpaces={false}
          />
        </Collapsible>
      )}
    </>
  );
};
