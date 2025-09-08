import { Button, PaletteButton, PaletteButtonLabel } from '@axonivy/ui-components';
import React from 'react';
import { type ToolBarButton as ToolBarButtonType } from '../button';

interface ToolBarButtonProps {
  button: ToolBarButtonType;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ToolBarButton: React.FC<ToolBarButtonProps> = ({ button, isActive, onClick }) => {
  if (!button.showTitle) {
    return (
      <Button
        id={button.id}
        toggle={isActive}
        icon={button.icon}
        size='large'
        title={button.title}
        aria-label={button.title}
        onClick={onClick}
      />
    );
  }
  return (
    <PaletteButtonLabel key={button.id} label={button.title}>
      <PaletteButton id={button.id} toggle={isActive} icon={button.icon} label={button.title} onClick={onClick} />
    </PaletteButtonLabel>
  );
};
