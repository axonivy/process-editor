import type { VariableInfo } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import Collapsible from '../../widgets/collapsible/Collapsible';
import MappingPart from '../common/mapping-tree/MappingPart';
import RuleSelect from './RuleSelect';
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
  const { config, defaultConfig, update } = useRuleData();
  const { context } = useEditorContext();
  const { data: startItems } = useMeta('meta/start/rules', context, []);

  const variableInfo = useMemo<VariableInfo>(
    () => startItems.find(start => start.id === config.rule.rule)?.callParameter ?? { variables: [], types: {} },
    [config.rule.rule, startItems]
  );
  return (
    <>
      <Collapsible label={t('part.rule.title')} defaultOpen={true}>
        <RuleSelect
          start={config.rule.rule}
          onChange={change => update('rule', change)}
          starts={startItems}
          startIcon={IvyIcons.InitStart}
        />
      </Collapsible>
      <MappingPart
        data={config.rule.data}
        defaultData={defaultConfig.rule.data}
        variableInfo={variableInfo}
        onChange={change => update('data', change)}
        browsers={['attr', 'func', 'type']}
        defaultOpen={true}
      />
    </>
  );
};
