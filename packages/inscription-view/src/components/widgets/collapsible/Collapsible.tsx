import {
  ButtonGroup,
  CollapsibleContent,
  type CollapsibleControlProps,
  Collapsible as CollapsibleRoot,
  CollapsibleState,
  CollapsibleTrigger,
  Flex
} from '@axonivy/ui-components';
import type { ReactNode } from 'react';
import { memo, useEffect, useState } from 'react';
import type { FieldsetControl } from '../fieldset/fieldset-control';
import { type ValidationMessage, toMessageDataArray } from '../message/Message';

export type CollapsibleProps = {
  label: string;
  defaultOpen?: boolean;
  autoClosable?: boolean;
  children: ReactNode;
  controls?: Array<FieldsetControl>;
  validations?: Array<ValidationMessage>;
};

const Controls = ({ controls, ...props }: Pick<CollapsibleProps, 'controls'> & CollapsibleControlProps) => {
  if (controls) {
    return (
      <ButtonGroup
        {...props}
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

const State = ({ validations }: Pick<CollapsibleProps, 'validations'>) => {
  if (validations) {
    return <CollapsibleState messages={toMessageDataArray(validations)} />;
  }
  return null;
};

const Collapsible = ({ label, defaultOpen, validations, children, autoClosable, controls }: CollapsibleProps) => {
  const [open, setOpen] = useState(defaultOpen || (validations?.length ?? 0) > 0);
  useEffect(() => {
    if (autoClosable) {
      setOpen(!!defaultOpen);
    } else {
      if (defaultOpen) {
        setOpen(defaultOpen);
      }
    }
  }, [autoClosable, defaultOpen]);
  return (
    <CollapsibleRoot open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger control={props => <Controls {...props} controls={controls} />} state={<State validations={validations} />}>
        {label}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Flex direction='column' gap={3}>
          {children}
        </Flex>
      </CollapsibleContent>
    </CollapsibleRoot>
  );
};

export default memo(Collapsible);
