import type { IActionDispatcherProvider } from '@eclipse-glsp/client';
import React from 'react';
import { ShowInfoQuickActionMenuAction, ShowQuickActionMenuAction } from '../quick-action-menu-ui';
import { QuickActionColorPalette } from './QuickActionColorPalette';
import { QuickActionInfoPanel } from './QuickActionInfoPanel';
import { QuickActionItemPalette } from './QuickActionItemPalette';

type QuickActionMenuProps = {
  showMenuAction?: ShowQuickActionMenuAction | ShowInfoQuickActionMenuAction;
  actionDispatcher: IActionDispatcherProvider;
  closeUi: () => void;
};

export const QuickActionMenu: React.FC<QuickActionMenuProps> = ({ showMenuAction, actionDispatcher, closeUi }) => {
  if (!showMenuAction) {
    return null;
  }

  if (ShowQuickActionMenuAction.is(showMenuAction)) {
    return showMenuAction.isEditable ? (
      <QuickActionColorPalette action={showMenuAction} actionDispatcher={actionDispatcher} closeUi={closeUi} />
    ) : (
      <QuickActionItemPalette action={showMenuAction} actionDispatcher={actionDispatcher} closeUi={closeUi} />
    );
  }

  if (ShowInfoQuickActionMenuAction.is(showMenuAction)) {
    return <QuickActionInfoPanel action={showMenuAction} />;
  }

  return null;
};
