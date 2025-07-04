import { usePartState, type PartProps } from '../../editors/part/usePart';
import { useMailData } from './useMailData';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import { MAIL_TYPE } from '@axonivy/process-editor-inscription-protocol';
import { useMemo } from 'react';
import { useValidations } from '../../../context/useValidation';
import type { SelectItem } from '../../widgets/select/Select';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { PathFieldset } from '../common/path/PathFieldset';
import { MacroArea } from '../../widgets/code-editor/MacroArea';
import Fieldset from '../../widgets/fieldset/Fieldset';
import Select from '../../widgets/select/Select';
import { useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

export function useMailMessagePart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useMailData();
  const compareData = (data: MailData) => [data.message];
  const validations = useValidations(['message']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Content',
    name: t('part.mail.content.title'),
    state,
    content: <MailMessagePart />,
    icon: IvyIcons.Note
  };
}

const MailMessagePart = () => {
  const { t } = useTranslation();
  const { config, updateMessage } = useMailData();
  const typeItems = useMemo<SelectItem[]>(() => Object.values(MAIL_TYPE).map(value => ({ label: value, value })), []);

  return (
    <ValidationCollapsible label={t('part.mail.content.title')} defaultOpen={true}>
      <PathFieldset label={t('part.mail.content.message')} path='message'>
        <MacroArea
          value={config.message.body}
          onChange={change => updateMessage('body', change)}
          minHeight={250}
          browsers={['attr', 'func', 'cms']}
        />
      </PathFieldset>
      <Fieldset label={t('part.mail.content.type')}>
        <Select
          value={{ value: config.message.contentType, label: config.message.contentType }}
          items={typeItems}
          onChange={change => updateMessage('contentType', change.value)}
        />
      </Fieldset>
    </ValidationCollapsible>
  );
};
