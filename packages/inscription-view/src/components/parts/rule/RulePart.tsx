import { BasicInput } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import Collapsible from '../../widgets/collapsible/Collapsible';
import Fieldset from '../../widgets/fieldset/Fieldset';
import { useRuleData } from './useRuleData';

export function useRulePart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useRuleData();
  const state = usePartState(defaultConfig, config, []);
  return {
    id: 'Rule',
    name: t('part.rule.title'),
    state,
    content: <RulePart />,
    icon: IvyIcons.Rule
  };
}

const RulePart = () => {
  const { t } = useTranslation();
  return (
    <>
      <Collapsible label={t('part.rule.title')} defaultOpen={true}>
        <Fieldset label={t('part.rule.configuration')}>
          <BasicInput />
        </Fieldset>
        <Fieldset label={t('part.rule.data')}>
          <BasicInput />
        </Fieldset>
      </Collapsible>
    </>
  );
};
