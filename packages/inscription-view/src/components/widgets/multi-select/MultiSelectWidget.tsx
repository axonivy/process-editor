import { Button, Flex, IvyIcon, useField, useReadonly } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Combobox } from '@base-ui/react/combobox';
import React, { useMemo, useRef } from 'react';
import './MultiSelectWidget.css';

type SelectableItem = {
  name: string;
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
  return isImageUrl(icon)
    ? <img src={icon} alt='' aria-hidden='true' style={{ height: 18, width: 18 }} />
    : <span aria-hidden='true' style={{ fontSize: 18 }}>{icon}</span>;
}

export function MultiSelectWidget({ value, onChange, items, configKey }: MultiSelectWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { inputProps } = useField();
  const readonly = useReadonly();

  const itemIds = useMemo(() => items.map(item => item.name), [items]);

  const mergedItems = useMemo(() => {
    const merged = [...items];
    const mergedIds = merged.map(item => item.name);
    value.filter(v => !mergedIds.includes(v)).forEach(v => merged.push({ name: v, description: '', icon: '' }));
    return merged;
  }, [items, value]);

  return (
    <Combobox.Root items={itemIds} multiple value={value} onValueChange={onChange} disabled={readonly}>
      <Combobox.Chips className='ui-combobox-root' ref={containerRef}>
        <Combobox.Value>
          {(selectedItems: string[]) => (
            <>
              {selectedItems.map(itemName => {
                const item = mergedItems.find(i => i.name === itemName);
                return (
                  <Combobox.Chip
                    key={itemName}
                    className='ui-combobox-root-chip'
                    aria-label={itemName}
                    title={item ? `${item.description}` : itemName}
                  >
                    <Flex alignItems='center' gap={1}>
                      {renderIcon(item?.icon || '')}
                      <span>{itemName}</span>
                    </Flex>
                    <Combobox.ChipRemove render={<Button icon={IvyIcons.Close} />} />
                  </Combobox.Chip>
                );
              })}
              <Flex alignItems='center' gap={1} className='flex-1 min-w-fit'>
                <Combobox.Input
                  className='ui-combobox-root-input'
                  {...inputProps}
                  aria-label={configKey}
                  data-value={selectedItems.join(',')}
                />
                <Combobox.Trigger render={<Button icon={IvyIcons.Chevron} rotate={90} />} />
              </Flex>
            </>
          )}
        </Combobox.Value>
      </Combobox.Chips>

      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} anchor={containerRef}>
          <Combobox.Popup className='ui-combobox-popup'>
            <Combobox.Empty className='ui-combobox-empty'></Combobox.Empty>
            <Combobox.List>
              {(itemName: string) => (
                <Combobox.Item key={itemName} className='ui-combobox-item' value={itemName}>
                  <Combobox.ItemIndicator className='ui-combobox-item-indicator'>
                    <IvyIcon icon={IvyIcons.Check} />
                  </Combobox.ItemIndicator>
                  <div className='flex-1 truncate'>{itemLabel(itemName, mergedItems)}</div>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

function itemLabel(itemName: string, items: SelectableItem[]): React.ReactNode {
  const item = items.find(i => i.name === itemName);
  if (!item) {
    return itemName;
  }

  if (item.icon && item.icon !== '') {
    return (
      <Flex alignItems='center' gap={2}>
        {renderIcon(item.icon)}
        <span>{item.name}</span>
        {item.description && <span className='combobox-menu-entry-additional'>{` - ${item.description}`}</span>}
      </Flex>
    );
  }

  if (item.description) {
    return (
      <Flex direction='column' gap={1}>
        <span>{item.name}</span>
        {item.description && <span className='combobox-menu-entry-additional'>{` - ${item.description}`}</span>}
      </Flex>
    );
  }

  return item.name;
}
