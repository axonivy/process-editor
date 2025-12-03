import { cn } from '@axonivy/ui-components';
import React, { type ComponentProps } from 'react';
import './QuickActionPaletteWrapper.css';

export const QuickActionPaletteWrapper = ({ className, ...props }: ComponentProps<'div'>) => (
  <div className={cn('bar-menu quick-action-bar-menu', className)} {...props} />
);
