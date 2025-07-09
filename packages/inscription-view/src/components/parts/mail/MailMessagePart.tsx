import { usePartDirty, usePartState, type PartProps } from '../../editors/part/usePart';
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
import useMaximizedCodeEditor from '../../browser/useMaximizedCodeEditor';
import { IvyIcons } from '@axonivy/ui-icons';

export function useMailMessagePart(): PartProps {
  const { config, initConfig, defaultConfig, resetMessage } = useMailData();
  const compareData = (data: MailData) => [data.message];
  const validations = useValidations(['message']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: 'Content', state, reset: { dirty, action: () => resetMessage() }, content: <MailMessagePart /> };
}

const MailMessagePart = () => {
  const { config, defaultConfig, updateMessage } = useMailData();
  const typeItems = useMemo<SelectItem[]>(() => Object.values(MAIL_TYPE).map(value => ({ label: value, value })), []);
  const { maximizeState, maximizeCode } = useMaximizedCodeEditor();

  return (
    <ValidationCollapsible label='Content' defaultOpen={config.message.body !== defaultConfig.message.body} controls={[maximizeCode]}>
      <PathFieldset label='Message' path='message'>
        <MacroArea
          value={config.message.body}
          onChange={change => updateMessage('body', change)}
          browsers={['attr', 'func', 'cms']}
          maximizeState={maximizeState}
          maximizedHeader={{ title: 'Message', icon: IvyIcons.Note }}
        />
      </PathFieldset>
      <Fieldset label='Type'>
        <Select
          value={{ value: config.message.contentType, label: config.message.contentType }}
          items={typeItems}
          onChange={change => updateMessage('contentType', change.value)}
        />
      </Fieldset>
    </ValidationCollapsible>
  );
};
