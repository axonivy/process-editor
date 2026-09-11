import type { RuleStart } from '@axonivy/process-editor-inscription-protocol';
import type { IvyIcons } from '@axonivy/ui-icons';
import { useMemo } from 'react';
import type { ComboboxItem } from '../../widgets/combobox/Combobox';
import Combobox from '../../widgets/combobox/Combobox';
import IvyIcon from '../../widgets/IvyIcon';

export type RuleStartItem = RuleStart & ComboboxItem;

type RuleSelectProps = {
  start: string;
  onChange: (change: string) => void;
  starts: RuleStart[];
  startIcon: IvyIcons;
};

const RuleSelect = ({ start, onChange, starts, startIcon }: RuleSelectProps) => {
  const items = useMemo<RuleStartItem[]>(
    () =>
      starts.map(start => {
        return { ...start, value: start.id };
      }),
    [starts]
  );

  const itemFilter = (item: RuleStartItem, input?: string) => {
    if (!input) {
      return true;
    }
    const filter = input.toLowerCase();
    return (
      item.value.toLowerCase().includes(filter) ||
      item.packageName.toLowerCase().includes(filter) ||
      item.project.toLowerCase().includes(filter)
    );
  };

  const comboboxItem = (item: RuleStart) => {
    return (
      <>
        <div title={item.rule} aria-label={item.rule}>
          <IvyIcon icon={startIcon} />
          <span>{item.rule}</span>
          <span className='combobox-menu-entry-additional'>{` - ${item.packageName}`}</span>
        </div>
      </>
    );
  };

  return <Combobox items={items} comboboxItem={comboboxItem} itemFilter={itemFilter} value={start} onChange={onChange} />;
};

export default RuleSelect;
