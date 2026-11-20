import { BasicField, ButtonGroup, type BasicFieldProps } from '@axonivy/ui-components';
import { memo } from 'react';
import { useAction } from '../../../context/useAction';
import { toMessageData, type ValidationMessage } from '../message/Message';
import type { FieldsetControl } from './fieldset-control';

export type FieldsetProps = Omit<BasicFieldProps, 'message' | 'control'> & {
  controls?: Array<FieldsetControl>;
  validation?: ValidationMessage;
};

const Controls = ({ controls }: Pick<FieldsetProps, 'controls'>) => {
  if (!controls) {
    return null;
  }
  return (
    <ButtonGroup
      controls={controls.map(({ action, icon, label, active }) => ({
        icon,
        title: label,
        onClick: action,
        toggle: active,
        'aria-label': label
      }))}
    />
  );
};

const Fieldset = ({ label, controls, validation, ...props }: FieldsetProps) => {
  const openUrl = useAction('openPage');
  return <BasicField label={label} message={toMessageData(openUrl, validation)} control={<Controls controls={controls} />} {...props} />;
};

export default memo(Fieldset);
