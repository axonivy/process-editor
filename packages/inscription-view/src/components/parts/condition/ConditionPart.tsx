import type { ConditionData } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../context/useEditorContext';
import { useMeta } from '../../../context/useMeta';
import { PathContext } from '../../../context/usePath';
import { useValidations } from '../../../context/useValidation';
import { usePartState, type PartProps } from '../../editors/part/usePart';
import { Condition } from './condition';
import ConditionTable from './ConditionTable';
import { useConditionData } from './useConditionData';

export function useConditionPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useConditionData();
  const compareData = (data: ConditionData) => [data.conditions];
  const validations = useValidations(['conditions']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validations);
  return {
    id: 'Condition',
    name: t('part.condition.title'),
    state: state,
    content: <ConditionPart />,
    icon: IvyIcons.Reconnect
  };
}

const ConditionPart = () => {
  const { config, update } = useConditionData();
  const { elementContext } = useEditorContext();
  const { data: outConnectors } = useMeta('meta/connector/out', elementContext, []);
  const conditions = useMemo(() => {
    const conds = Condition.of(config.conditions);
    outConnectors.forEach(connector => Condition.replace(conds, connector));
    return conds;
  }, [config.conditions, outConnectors]);

  return (
    <PathContext path='conditions'>
      <ConditionTable data={conditions} onChange={conditions => update('conditions', Condition.to(conditions))} />
    </PathContext>
  );
};
