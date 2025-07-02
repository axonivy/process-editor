import { usePartState, type PartProps } from '../../editors/part/usePart';
import { useMailData } from './useMailData';
import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import { useValidations } from '../../../context/useValidation';
import type { BrowserType } from '../../browser/useBrowser';
import { PathCollapsible } from '../common/path/PathCollapsible';
import { PathFieldset } from '../common/path/PathFieldset';
import { MacroInput } from '../../widgets/code-editor/MacroInput';
import { useTranslation } from 'react-i18next';
import { IvyIcons } from '@axonivy/ui-icons';

export function useMailHeaderPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useMailData();
  const compareData = (data: MailData) => [data.headers];
  const headerValidations = useValidations(['headers']);
  const state = usePartState(compareData(defaultConfig), compareData(config), headerValidations);
  return {
    id: 'Header',
    name: t('part.mail.header.title'),
    state,
    content: <MailHeaderPart />,
    icon: IvyIcons.EMail
  };
}

const MailHeaderPart = () => {
  const { t } = useTranslation();
  const { config, updateHeader } = useMailData();
  const borwserTypes: BrowserType[] = ['attr', 'func', 'cms'];

  return (
    <>
      <PathCollapsible label={t('part.mail.header.title')} path='headers' defaultOpen={true}>
        <PathFieldset label={t('part.mail.header.subject')} path='subject'>
          <MacroInput value={config.headers.subject} onChange={change => updateHeader('subject', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label={t('part.mail.header.from')} path='from'>
          <MacroInput value={config.headers.from} onChange={change => updateHeader('from', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label={t('part.mail.header.replyTo')} path='replyTo'>
          <MacroInput value={config.headers.replyTo} onChange={change => updateHeader('replyTo', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label={t('part.mail.header.to')} path='to'>
          <MacroInput value={config.headers.to} onChange={change => updateHeader('to', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label={t('part.mail.header.cc')} path='cc'>
          <MacroInput value={config.headers.cc} onChange={change => updateHeader('cc', change)} browsers={borwserTypes} />
        </PathFieldset>
        <PathFieldset label={t('part.mail.header.bcc')} path='bcc'>
          <MacroInput value={config.headers.bcc} onChange={change => updateHeader('bcc', change)} browsers={borwserTypes} />
        </PathFieldset>
      </PathCollapsible>
    </>
  );
};
