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

  bounds: Bounds;
  drawSelectionBox: boolean;

  showMenuAction?: ShowQuickActionMenuAction | ShowInfoQuickActionMenuAction;
  actionDispatcher: IActionDispatcherProvider;
  closeMenu: () => void;
  closeUi: () => void;

  container?: HTMLElement | null;
};

export const QuickActionUI: React.FC<QuickActionUIProps> = ({
  quickActions,
  activeQuickAction,
  onQuickActionClick,
  bounds,
  drawSelectionBox,
  showMenuAction,
  actionDispatcher,
  closeMenu,
  closeUi,
  container
}) => {
  if (quickActions.length === 0) {
    return null;
  }

  return (
    <Popover open={Bounds.isValid(bounds)}>
      <PopoverAnchor asChild>
        <div
          className='quick-action-selection-box'
          style={{
            top: `${bounds.y}px`,
            left: `${bounds.x}px`,
            height: `${bounds.height}px`,
            width: `${bounds.width}px`,
            visibility: drawSelectionBox ? 'visible' : 'hidden'
          }}
        />
      </PopoverAnchor>
      <PopoverContent
        className={'quick-action-ui ui-popover-content actions-' + quickActions.length}
        side='bottom'
        align='center'
        sideOffset={10}
        collisionPadding={8}
        onOpenAutoFocus={e => e.preventDefault()}
        onEscapeKeyDown={closeMenu}
        container={container}
        collisionBoundary={container}
      >
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
          {showMenuAction && <QuickActionMenu showMenuAction={showMenuAction} actionDispatcher={actionDispatcher} closeUi={closeUi} />}
        </Flex>
      </PopoverContent>
    </Popover>
  );
};
