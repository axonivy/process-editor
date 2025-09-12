import type { Action, BoundsAware, GModelElement, GParentElement, Hoverable } from '@eclipse-glsp/client';
import { GChildElement, hoverFeedbackFeature, selectFeature } from '@eclipse-glsp/client';

export const breakpointFeature = Symbol('breakpointFeature');

export type Breakable = BoundsAware;

export function isBreakable(element: GModelElement): element is GModelElement & Breakable {
  return element.hasFeature(breakpointFeature);
}

export function isBreaked(element: GModelElement | undefined): element is GModelElement & Breakable {
  return element !== undefined && isBreakable(element);
}

export class SBreakpointHandle extends GChildElement implements Hoverable {
  static readonly TYPE = 'breakpoint-handle';

  constructor(
    public readonly condition: string = '',
    public readonly disabled: boolean = false,
    public readonly globalDisabled: boolean = false,
    public override readonly type: string = SBreakpointHandle.TYPE,
    public readonly hoverFeedback: boolean = false
  ) {
    super();
  }

  override hasFeature(feature: symbol): boolean {
    return feature === hoverFeedbackFeature || feature === selectFeature;
  }

  mouseUp(): Action[] {
    return [];
  }
}

export function addBreakpointHandles(element: GParentElement, condition: string, disabled: boolean, globalDisabled: boolean): void {
  removeBreakpointHandles(element);
  element.add(new SBreakpointHandle(condition, disabled, globalDisabled));
}

export function removeBreakpointHandles(element: GParentElement): void {
  element.removeAll(child => child instanceof SBreakpointHandle);
}
