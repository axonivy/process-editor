import { Field, Label, RadioGroup, RadioGroupItem } from '@axonivy/ui-components';
import type { ComponentProps } from 'react';

export type RadioItemProps<T> = { value: T; label: string; description?: string };

type RadioProps<T extends string> = Omit<ComponentProps<typeof RadioGroup>, 'value' | 'onChange'> & {
  value: T;
  onChange: (change: T) => void;
  items: RadioItemProps<T>[];
};

const Radio = <T extends string>({ value, onChange, items, orientation = 'vertical', ...props }: RadioProps<T>) => (
  <RadioGroup value={value} onValueChange={onChange} orientation={orientation} {...props}>
    {items.map((item, index) => (
      <RadioItem key={`${index}-${item.value}`} {...item} />
    ))}
  </RadioGroup>
);

const RadioItem = <T extends string>({ label, value, description }: RadioItemProps<T>) => (
  <Field direction='row' alignItems='center' gap={2}>
    <RadioGroupItem value={value} />
    <Label aria-label={label}>
      {label}
      <i>{description ? ` : ${description}` : ''}</i>
    </Label>
  </Field>
);

export default Radio;
