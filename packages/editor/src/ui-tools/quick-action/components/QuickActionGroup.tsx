import { Button, Flex } from '@axonivy/ui-components';
import React from 'react';
import type { QuickAction, QuickActionLocation } from '../quick-action';

interface QuickActionGroupProps {
  quickActions: QuickAction[];
  location: QuickActionLocation;
  activeQuickAction?: string;
  onQuickActionClick: (quickAction: QuickAction) => void;
}

export const QuickActionGroup: React.FC<QuickActionGroupProps> = ({
  quickActions,
  location,
  activeQuickAction: activeActionId,
  onQuickActionClick
}) => {
  const actionsForLocation = quickActions
    .filter(quickAction => quickAction.location === location)
    .sort((a, b) => a.sorting.localeCompare(b.sorting));

  if (actionsForLocation.length === 0) {
    return null;
  }

  return (
    <Flex className='quick-actions-group' gap={1}>
      {actionsForLocation.map(quickAction => (
        <Button
          key={quickAction.title}
          icon={quickAction.icon}
          size='large'
          toggle={activeActionId === quickAction.title}
          title={quickAction.title}
          aria-label={quickAction.title}
          onClick={() => onQuickActionClick(quickAction)}
        />
      ))}
    </Flex>
  );
};
