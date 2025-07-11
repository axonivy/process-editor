import type { BoundsAware, GModelElement, Selectable } from '@eclipse-glsp/client';
import { GParentElement, isBoundsAware, isSelectable } from '@eclipse-glsp/client';

export const quickActionFeature = Symbol('quickActionFeature');

export interface QuickActionAware extends BoundsAware, Selectable {}

export function isQuickActionAware(element: GModelElement): element is GParentElement & QuickActionAware {
  return isBoundsAware(element) && isSelectable(element) && element instanceof GParentElement && element.hasFeature(quickActionFeature);
}
