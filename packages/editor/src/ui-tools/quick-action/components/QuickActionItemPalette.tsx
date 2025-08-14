import { BasicPalette, Popover, PopoverAnchor, PopoverContent, type PaletteConfig, type PaletteItemConfig } from '@axonivy/ui-components';
import { PaletteItem, type IActionDispatcherProvider } from '@eclipse-glsp/client';
import React from 'react';
import { MenuIcons } from '../../menu/icons';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';

interface QuickActionItemPaletteProps {
  action: ShowQuickActionMenuAction;
  actionDispatcher: IActionDispatcherProvider;
  anchor?: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export const QuickActionItemPalette: React.FC<QuickActionItemPaletteProps> = ({ action, actionDispatcher, anchor, onClose }) => {
  const [sections, setSections] = React.useState<PaletteConfig['sections']>({});

  const paletteItemToConfig = React.useCallback(
    (item: PaletteItem): PaletteItemConfig => ({
      name: item.label,
      description: item.label,
      icon: item.icon ? MenuIcons.get(item.icon) : undefined,
      onClick: async () => {
        const dispatcher = await actionDispatcher();
        const actions = action.actions(item, action.elementIds);
        dispatcher.dispatchAll(actions);
        onClose?.();
      }
    }),
    [action, actionDispatcher, onClose]
  );

  React.useEffect(() => {
    const loadPaletteItems = async () => {
      const paletteItems = await Promise.resolve(action.paletteItems());
      const sections = paletteItems.reduce((sections: Record<string, PaletteItemConfig[]>, item: PaletteItem) => {
        const sectionName = item.label;
        if (!sections[sectionName]) {
          sections[sectionName] = [];
        }
        const items = item.children ?? [item];
        items.forEach(child => sections[sectionName].push(paletteItemToConfig(child)));
        return sections;
      }, {});

      setSections(sections);
    };
    loadPaletteItems();
  }, [action, actionDispatcher, onClose]);

  if (!anchor?.current) {
    return null;
  }

  return (
    <Popover open={true} onOpenChange={open => !open && onClose()}>
      <PopoverAnchor virtualRef={{ current: anchor.current }} />
      <PopoverContent sideOffset={0} className='bar-menu quick-action-bar-menu'>
        <BasicPalette
          options={{
            searchPlaceholder: 'Search actions...',
            emptyMessage: 'No actions available',
            searchFilter: (item, term) => item.description.toLocaleLowerCase().includes(term.toLocaleLowerCase())
          }}
          sections={sections}
        />
      </PopoverContent>
    </Popover>
  );
};
