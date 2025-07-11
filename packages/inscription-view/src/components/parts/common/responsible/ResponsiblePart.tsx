import type { WfResponsible } from '@axonivy/process-editor-inscription-protocol';
import { useTranslation } from 'react-i18next';
import { deepEqual } from '../../../../utils/equals';
import { PathCollapsible } from '../path/PathCollapsible';
import { PathFieldset } from '../path/PathFieldset';
import { ValidationFieldset } from '../path/validation/ValidationFieldset';
import ResponsibleSelect, { type ResponsibleSelectProps } from './ResponsibleSelect';

type ResponsibleCollapsibleProps = ResponsibleSelectProps & { defaultResponsible: WfResponsible; defaultOpen?: boolean };

export const ResponsibleCollapsible = (props: ResponsibleCollapsibleProps) => {
  const { t } = useTranslation();
  return (
    <PathCollapsible
      label={t('label.responsible')}
      path='responsible'
      defaultOpen={props.defaultOpen ?? !deepEqual(props.responsible, props.defaultResponsible)}
    >
      <ValidationFieldset>
        <ResponsibleSelect {...props} />
      </ValidationFieldset>
    </PathCollapsible>
  );
};

export const ResponsiblePart = (props: ResponsibleSelectProps) => {
  const { t } = useTranslation();
  return (
    <PathFieldset label={t('label.responsible')} path='responsible'>
      <ResponsibleSelect {...props} />
    </PathFieldset>
  );
};
