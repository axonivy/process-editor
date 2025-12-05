import type { interfaces } from 'inversify';
import { IVY_TYPES } from './types';

export interface IvyViewerOptions {
  hideSensitiveInfo: boolean;
}

export const defaultIvyViewerOptions = (): IvyViewerOptions =>
  <IvyViewerOptions>{
    hideSensitiveInfo: false
  };

/**
 * Utility function to partially set viewer options. Default values (from `defaultIvyViewerOptions`) are used for
 * options that are not specified.
 */
export function configureIvyViewerOptions(
  context: { bind: interfaces.Bind; isBound: interfaces.IsBound; rebind: interfaces.Rebind },
  options: Partial<IvyViewerOptions>
): void {
  const opt: IvyViewerOptions = {
    ...defaultIvyViewerOptions(),
    ...options
  };
  if (context.isBound(IVY_TYPES.IvyViewerOptions)) {
    context.rebind(IVY_TYPES.IvyViewerOptions).toConstantValue(opt);
  } else {
    context.bind(IVY_TYPES.IvyViewerOptions).toConstantValue(opt);
  }
}

/**
 * Utility function to partially override the currently configured viewer options in a DI container.
 */
export function overrideIvyViewerOptions(container: interfaces.Container, options: Partial<IvyViewerOptions>): IvyViewerOptions {
  const opt = container.get<IvyViewerOptions>(IVY_TYPES.IvyViewerOptions);
  safeAssign(opt, options);
  return opt;
}

export function safeAssign<T extends object>(target: T, partial: Partial<T>): T {
  return Object.assign(target, partial);
}
