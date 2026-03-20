import {
  BasicSelect,
  Flex,
  SelectContent,
  SelectGroup,
  SelectItem,
  Select as SelectPrimitve,
  SelectTrigger,
  SelectValue
} from '@axonivy/ui-components';
import { useMemo } from 'react';

export type SelectItem<T = string> = {
  label: string;
  value: T;
};

export const EMPTY_SELECT_ITEM: SelectItem = { label: '', value: '' };

export type SelectProps<T = SelectItem> = {
  value?: T;
  onChange: (value: T) => void;
  items: T[];
  emptyItem?: boolean;
  disabled?: boolean;
};

export const Select = ({ value, onChange, items, emptyItem, disabled }: SelectProps) => {
  const onValueChange = (change: string) => {
    const item = items.find(({ value }) => value === change);
    onChange(item ?? EMPTY_SELECT_ITEM);
  };

  return <BasicSelect value={value?.value} onValueChange={onValueChange} items={items} emptyItem={emptyItem} disabled={disabled} />;
};

export type IconSelectItem = SelectItem & { iconUrl?: string };

export const IconSelect = ({ value, onChange, items, emptyItem, ...props }: SelectProps<IconSelectItem>) => {
  const unknownValue = useMemo(() => {
    if (value && items.find(item => item.value === value.value) === undefined) {
      return value.value;
    }
    return undefined;
  }, [items, value]);
  const onValueChange = (change: string) => {
    if (change === ' ') {
      change = '';
    }
    const item = items.find(({ value }) => value === change);
    onChange(item ?? EMPTY_SELECT_ITEM);
  };

  return (
    <SelectPrimitve value={value?.value} onValueChange={onValueChange} {...props}>
      <SelectTrigger>
        <SelectValue>
          <IconItem item={value} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {emptyItem && value && <SelectItem value=' '></SelectItem>}
          {unknownValue && <SelectItem value={unknownValue}>{unknownValue}</SelectItem>}
          {items.map(item => (
            <SelectItem key={item.value} value={item.value} asChild>
              <IconItem item={item} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectPrimitve>
  );
};

const IconItem = ({ item }: { item?: IconSelectItem }) => {
  return (
    <Flex direction='row' alignItems='center' gap={1}>
      {item?.iconUrl && <img src={item.iconUrl} alt={item.label} style={{ height: 18 }} />}
      <span title={item?.label}>{item?.label}</span>
    </Flex>
  );
};
