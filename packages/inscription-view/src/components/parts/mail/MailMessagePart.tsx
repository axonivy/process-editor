import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import { MAIL_TYPE } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useValidations } from '../../../context/useValidation';
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import { MacroArea } from '../../widgets/code-editor/MacroArea';
import Fieldset from '../../widgets/fieldset/Fieldset';
import type { SelectItem } from '../../widgets/select/Select';
import Select from '../../widgets/select/Select';
import { PathFieldset } from '../common/path/PathFieldset';
import { ValidationCollapsible } from '../common/path/validation/ValidationCollapsible';
import { useMailData } from './useMailData';

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
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <ValidationCollapsible label={t('part.mail.content.title')} defaultOpen={true} controls={[maximizeCode]}>
      <PathFieldset label={t('part.mail.content.message')} path='message'>
        <MacroArea
          value={config.message.body}
          onChange={change => updateMessage('body', change)}
          minHeight={250}
          browsers={['attr', 'func', 'cms']}
          maximizeState={maximizeState}
          maximizedHeader={{ title: t('part.mail.content.message'), icon: IvyIcons.Note }}
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
