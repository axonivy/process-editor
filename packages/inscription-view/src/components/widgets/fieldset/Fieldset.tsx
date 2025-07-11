import { BasicField, ButtonGroup, type BasicFieldProps } from '@axonivy/ui-components';
import { memo } from 'react';
import { toMessageData, type ValidationMessage } from '../message/Message';
import type { FieldsetControl } from './fieldset-control';

export type FieldsetProps = Omit<BasicFieldProps, 'message' | 'control'> & {
  controls?: Array<FieldsetControl>;
  validation?: ValidationMessage;
};

const Controls = ({ controls }: Pick<FieldsetProps, 'controls'>) => {
  if (controls) {
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
  }
  return null;
};

const Fieldset = ({ label, controls, validation, ...props }: FieldsetProps) => {
  return <BasicField label={label} message={toMessageData(validation)} control={<Controls controls={controls} />} {...props} />;
};

export default memo(Fieldset);
