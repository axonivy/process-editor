import { PaletteButton, PaletteButtonLabel } from '@axonivy/ui-components';
import React from 'react';
import { type ToolBarButton as ToolBarButtonType } from '../button';

interface ToolBarButtonProps {
  button: ToolBarButtonType;
  isActive: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ToolBarButton: React.FC<ToolBarButtonProps> = ({ button, isActive, onClick }) => {
  const paletteButton = (
    <PaletteButton
      id={button.id}
      toggle={isActive}
      icon={button.icon}
      label={button.title}
      onClick={onClick}
      withoutChevron={!button.showTitle}
      style={{ fontSize: '16px' }}
    />
  );

  return button.showTitle ? (
    <PaletteButtonLabel key={button.id} label={button.title}>
      {paletteButton}
    </PaletteButtonLabel>
  ) : (
    paletteButton
  );
};
