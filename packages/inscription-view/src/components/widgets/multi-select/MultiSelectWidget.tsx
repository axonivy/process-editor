import { BasicMultiCombobox, Flex, useField, useReadonly, type BasicComboboxItem } from '@axonivy/ui-components';
import React, { useMemo } from 'react';

type SelectableItem = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

type MultiSelectWidgetProps = {
  value: string[];
  onChange: (value: string[]) => void;
  items: SelectableItem[];
  configKey: string;
};

function isImageUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') || url.startsWith('data:');
}

function renderIcon(icon: string): React.ReactNode {
  if (!icon || icon === '') return null;
  return isImageUrl(icon) ? (
    <img src={icon} alt='' aria-hidden='true' style={{ height: 18, width: 18 }} />
  ) : (
    <span aria-hidden='true' style={{ fontSize: 18 }}>
      {icon}
    </span>
  );
}

type MultiSelectWidgetItem = BasicComboboxItem & {
  icon?: string;
  description?: string;
};

export function MultiSelectWidget({ value, onChange, items, configKey }: MultiSelectWidgetProps) {
  const { inputProps } = useField();
  const readonly = useReadonly();

  const comboItems = useMemo(() => {
    const merged = [...items];
    const mergedIds = merged.map(item => item.id);
    value.filter(v => !mergedIds.includes(v)).forEach(v => merged.push({ id: v, label: v, description: '', icon: '' }));
    return merged.map(item => ({ value: item.id, label: item.label, icon: item.icon, description: item.description }));
  }, [items, value]);
  const comboValue = useMemo(() => value.map(v => comboItems.find(r => r.value === v) ?? { value: v, label: v }), [value, comboItems]);

  return (
    <BasicMultiCombobox
      items={comboItems}
      isItemEqualToValue={(itemValue, value) => itemValue.value === value.value}
      value={comboValue}
      onValueChange={items => onChange(items.map(item => item.value))}
      disabled={readonly}
      chipRenderer={(item: MultiSelectWidgetItem) => (
        <Flex alignItems='center' gap={1} title={item.description || item.value}>
          {renderIcon(item?.icon || '')}
          <span>{item?.label || item.value}</span>
        </Flex>
      )}
      itemRenderer={(item: MultiSelectWidgetItem) => <div className='flex-1 truncate'>{itemLabel(item)}</div>}
      aria-label={configKey}
      {...inputProps}
    />
  );
}

function itemLabel(item: MultiSelectWidgetItem): React.ReactNode {
  if (item.icon && item.icon !== '') {
    return (
      <Flex alignItems='center' gap={2}>
        {renderIcon(item.icon)}
        <span>{item.label}</span>
        {item.description && <span className='combobox-menu-entry-additional'>{` - ${item.description}`}</span>}
      </Flex>
    );
  }

  if (item.description) {
    return (
      <Flex direction='column' gap={1}>
        <span>{item.label}</span>
        {item.description && <span className='combobox-menu-entry-additional'>{` - ${item.description}`}</span>}
      </Flex>
    );
  }

  return item.label;
}
