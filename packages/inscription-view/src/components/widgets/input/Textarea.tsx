import type { TextareaProps as TextareaPrimitiveProps } from '@axonivy/ui-components';
import { Textarea as TextareaPrimitive } from '@axonivy/ui-components';
import { useEffect, useState } from 'react';

export type TextareaProps = Omit<TextareaPrimitiveProps, 'value' | 'onChange'> & {
  value?: string;
  onChange: (change: string) => void;
};

const Textarea = ({ value, onChange, ...props }: TextareaProps) => {
  const [currentValue, setCurrentValue] = useState(value ?? '');
  useEffect(() => {
    setCurrentValue(value ?? '');
  }, [value]);
  const updateValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const update = event.target.value;
    setCurrentValue(update);
    onChange(update);
  };
  return <TextareaPrimitive value={currentValue} onChange={updateValue} autoResize={true} {...props} />;
};

export default Textarea;
