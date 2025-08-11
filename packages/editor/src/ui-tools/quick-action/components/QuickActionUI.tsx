import { Flex, Popover, PopoverAnchor, PopoverContent } from '@axonivy/ui-components';
import { Bounds, type IActionDispatcherProvider } from '@eclipse-glsp/client';
import React from 'react';
import type { QuickAction } from '../quick-action';
import { ShowInfoQuickActionMenuAction, ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { QuickActionGroup } from './QuickActionGroup';
import { QuickActionMenu } from './QuickActionMenu';

type QuickActionUIProps = {
  quickActions: QuickAction[];
  activeQuickAction?: string;
  onQuickActionClick: (quickAction: QuickAction) => void;

  selectionBounds: Promise<Bounds>;
  drawSelectionBox: boolean;

  showMenuAction?: ShowQuickActionMenuAction | ShowInfoQuickActionMenuAction;
  actionDispatcher: IActionDispatcherProvider;
  onCloseMenu: () => void;
};

export const QuickActionUI: React.FC<QuickActionUIProps> = ({
  quickActions,
  activeQuickAction,
  onQuickActionClick,
  selectionBounds,
  drawSelectionBox,
  showMenuAction,
  actionDispatcher,
  onCloseMenu
}) => {
  if (quickActions.length === 0) {
    return null;
  }
  const bounds = React.use(selectionBounds);

  return (
    <Popover open={true}>
      {drawSelectionBox && (
        <div
          className='quick-action-selection-box'
          style={{
            top: `${bounds.y}px`,
            left: `${bounds.x}px`,
            height: `${bounds.height}px`,
            width: `${bounds.width}px`
          }}
        />
      )}
      <PopoverAnchor virtualRef={{ current: { getBoundingClientRect: () => DOMRect.fromRect(bounds) } }} />
      <PopoverContent className='quick-action-ui' side='bottom' align='center' sideOffset={10}>
        <Flex direction='column' alignItems='center'>
          <Flex className='quick-actions-bar' gap={4}>
            <QuickActionGroup
              quickActions={quickActions}
              location='Left'
              activeQuickAction={activeQuickAction}
              onQuickActionClick={onQuickActionClick}
            />
            <QuickActionGroup
              quickActions={quickActions}
              location='Middle'
              activeQuickAction={activeQuickAction}
              onQuickActionClick={onQuickActionClick}
            />
            <QuickActionGroup
              quickActions={quickActions}
              location='Right'
              activeQuickAction={activeQuickAction}
              onQuickActionClick={onQuickActionClick}
            />
          </Flex>
          {showMenuAction && <QuickActionMenu showMenuAction={showMenuAction} actionDispatcher={actionDispatcher} onClose={onCloseMenu} />}
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
