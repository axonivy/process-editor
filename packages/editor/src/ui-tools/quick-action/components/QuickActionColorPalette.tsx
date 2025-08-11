import {
  Button,
  cn,
  Flex,
  IvyIcon,
  Palette,
  PaletteSection,
  Popover,
  PopoverAnchor,
  PopoverContent,
  type PaletteItemConfig,
  type PaletteItemProps
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { PaletteItem, type IActionDispatcherProvider } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';
import type { ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { EditColorForm } from './EditColorForm';

interface QuickActionColorPaletteProps {
  action: ShowQuickActionMenuAction;
  actionDispatcher: IActionDispatcherProvider;
  anchor?: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

type ColorItemConfig = PaletteItemConfig & {
  icon: string;
  source: PaletteItem;
};

export const QuickActionColorPalette: React.FC<QuickActionColorPaletteProps> = ({ action, actionDispatcher, anchor, onClose }) => {
  const [sections, setSections] = React.useState<Record<string, ColorItemConfig[]>>({});
  const [showEditForm, setShowEditForm] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PaletteItem | undefined>(undefined);

  React.useEffect(() => {
    const loadPaletteItems = async () => {
      const paletteItems = await Promise.resolve(action.paletteItems());

      const sections = paletteItems.reduce((sections: Record<string, ColorItemConfig[]>, item: PaletteItem) => {
        const sectionName = item.label;
        if (!sections[sectionName]) {
          sections[sectionName] = [];
        }
        const items = item.children ?? [item];

        items.forEach(child => sections[sectionName].push(colorItemToConfig(child)));
        if (action.isEditable) {
          sections[sectionName].push({
            name: t('label.colorNew'),
            description: t('label.colorNew'),
            icon: IvyIcons.Plus,
            source: { id: 'new.color', label: t('label.colorNew'), actions: [], sortString: 'new' },
            onClick: () => {
              setEditingItem(undefined);
              setShowEditForm(true);
            }
          });
        }
        return sections;
      }, {});

      setSections(sections);
    };
    loadPaletteItems();
  }, [action, actionDispatcher, onClose]);

  const colorItemToConfig = React.useCallback(
    (item: PaletteItem): ColorItemConfig => ({
      name: item.label,
      description: item.label,
      icon: (item.icon || 'var(--glsp-foreground)') as IvyIcons,
      onClick: async () => {
        const dispatcher = await actionDispatcher();
        const actions = action.actions(item, action.elementIds);
        dispatcher.dispatchAll(actions);
        onClose?.();
      },
      source: item
    }),
    [action, actionDispatcher, onClose]
  );

  const handleEditColor = React.useCallback(
    (item: PaletteItem) => (e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingItem(item);
      setShowEditForm(true);
    },
    []
  );

  const handleCloseEditForm = React.useCallback(() => {
    setShowEditForm(false);
    setEditingItem(undefined);
  }, []);

  const ColorPaletteItem = React.useMemo(
    () =>
      ({ name, description, icon, onClick, classNames, source }: PaletteItemProps<ColorItemConfig>) => {
        const isNewColor = source.id === 'new.color';
        const isDefaultColor = name === 'default';

        return (
          <button
            className={cn(classNames.paletteItem, 'ui-palette-color-item', isNewColor ? 'new-color' : '')}
            onClick={onClick}
            title={description}
          >
            <Flex direction='column' gap={1} alignItems='center'>
              <Flex className={cn(classNames.paletteItemIcon, 'ui-palette-item-icon')} justifyContent='center' alignItems='center'>
                {isNewColor ? (
                  <IvyIcon icon={icon ?? IvyIcons.Plus} className='new-color-icon' />
                ) : (
                  <span className='color-icon' style={{ backgroundColor: icon }}></span>
                )}
              </Flex>
              <Flex justifyContent='center' gap={2} onClick={handleEditColor(source)} data-function='edit-color'>
                {action.isEditable && !isDefaultColor && !isNewColor ? (
                  <Button title={t('label.colorEdit')} icon={IvyIcons.Edit} style={{ fontSize: '10px', height: '10px' }}>
                    {name}
                  </Button>
                ) : (
                  <span>{name} </span>
                )}
              </Flex>
            </Flex>
          </button>
        );
      },
    [action.isEditable, handleEditColor]
  );

  if (!anchor?.current) {
    return null;
  }

  return (
    <Popover open={true} onOpenChange={open => !open && onClose()}>
      <PopoverAnchor virtualRef={{ current: anchor.current }} />
      <PopoverContent sideOffset={0} className='bar-menu quick-action-bar-menu'>
        <Palette<ColorItemConfig>
          options={{
            searchPlaceholder: 'Search colors...',
            emptyMessage: 'No colors available'
          }}
          sections={sections}
        >
          {(title, items) => (
            <PaletteSection<ColorItemConfig> key={title} title={title} items={items}>
              {item => <ColorPaletteItem key={item.name} {...item} />}
            </PaletteSection>
          )}
        </Palette>
        {showEditForm && (
          <EditColorForm
            actionDispatcher={actionDispatcher}
            elementIds={action.elementIds}
            item={editingItem}
            onClose={handleCloseEditForm}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};
