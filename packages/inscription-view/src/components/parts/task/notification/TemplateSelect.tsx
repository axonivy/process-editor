import { useMemo } from 'react';
import { useTemplates } from './useTemplates';
import type { WfNotification } from '@axonivy/process-editor-inscription-protocol';
import { PathFieldset } from '../../common/path/PathFieldset';
import Select, { type SelectItem } from '../../../widgets/select/Select';
import { useTranslation } from 'react-i18next';

const TemplateSelect = ({ notification, onChange }: { notification: WfNotification; onChange: (value: SelectItem) => void }) => {
  const { t } = useTranslation();
  const templates = useTemplates();
  const selectedTemplate = useMemo<SelectItem>(
    () => templates.find(e => e.value === notification.template) ?? { value: notification.template, label: notification.template },
    [notification.template, templates]
  );
  return (
    <PathFieldset label={t('part.task.template')} path='template'>
      <div className='template-select'>
        <Select value={selectedTemplate} items={templates} onChange={onChange} disabled={notification.suppress} />
      </div>
    </PathFieldset>
  );
};

export default TemplateSelect;
