import {
  Flex,
  Select as SelectPrimitive,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useField,
  useReadonly
} from '@axonivy/ui-components';
import { useMemo } from 'react';
import { ProgramSelectIcon, type ProgramSelectableItem } from './ProgramSelectItem';

type ProgramSelectWidgetProps = {
  value: string;
  onChange: (value: string) => void;
  items: ProgramSelectableItem[];
  configKey: string;
};

export function ProgramSelectWidget({ value, onChange, items, configKey }: ProgramSelectWidgetProps) {
  const { inputProps } = useField();
  const readonly = useReadonly();
  const selectItems = useMemo(() => {
    const merged = [...items];
    if (value && !merged.some(item => item.id === value)) {
      merged.push({ id: value, label: value });
    }
    return merged;
  }, [items, value]);
  const selectedItem = selectItems.find(item => item.id === value);

  return (
    <SelectPrimitive value={value || undefined} onValueChange={onChange} disabled={readonly}>
      <SelectTrigger aria-label={configKey} {...inputProps}>
        <SelectValue>
          {selectedItem && <ProgramSelectValue item={selectedItem} />}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {selectItems.map(item => (
            <SelectItem key={item.id} value={item.id} asChild>
              <ProgramSelectOption item={item} />
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectPrimitive>
  );
}

const ProgramSelectValue = ({ item }: { item: ProgramSelectableItem }) => (
  <Flex alignItems='center' gap={2}>
    <ProgramSelectIcon icon={item.icon} />
    <span className='truncate'>{item.label}</span>
  </Flex>
);

const ProgramSelectOption = ({ item }: { item: ProgramSelectableItem }) => (
  <Flex alignItems='center' gap={2} title={item.description || item.id}>
    <ProgramSelectIcon icon={item.icon} />
    <span className='truncate'>{item.label}</span>
    {item.description && <span className='combobox-menu-entry-additional'>{` - ${item.description}`}</span>}
  </Flex>
);
