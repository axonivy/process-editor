import { FeatureModule, RemoveMarqueeAction, TYPES, bindAsService, configureActionHandler } from '@eclipse-glsp/client';
import type { interfaces } from 'inversify';

import { IVY_TYPES } from '../../types';
import { SelectColorQuickActionProvider } from './color/action';
import { ColorPaletteHandler } from './color/action-handler';
import { ConnectQuickActionProvider, QuickActionEdgeCreationTool, QuickActionTriggerEdgeCreationAction } from './edge/edge-creation-tool';
import { SelectIconQuickActionProvider } from './icon/action';
import { IconPaletteHandler } from './icon/action-handler';
import { InfoQuickActionProvider } from './info/action';
import {
  CreateActivityQuickActionProvider,
  CreateAllElementsQuickActionProvider,
  CreateEventQuickActionProvider,
  CreateGatewayQuickActionProvider
} from './node/actions';
import { AutoAlignQuickActionProvider, DeleteQuickActionProvider } from './quick-action';
import { ShowInfoQuickActionMenuAction, ShowQuickActionMenuAction } from './quick-action-menu-ui';
import { QuickActionUI } from './quick-action-ui';
import { SelectActivityTypeQuickActionProvider } from './types/action';
import { TypesPaletteHandler } from './types/action-handler';

const ivyQuickActionModule = new FeatureModule((bind, _unbind, isBound) => {
  bindAsService(bind, TYPES.IUIExtension, QuickActionUI);

  configureActionHandler({ bind, isBound }, ShowQuickActionMenuAction.KIND, QuickActionUI);
  configureActionHandler({ bind, isBound }, ShowInfoQuickActionMenuAction.KIND, QuickActionUI);
  configureActionHandler({ bind, isBound }, RemoveMarqueeAction.KIND, QuickActionUI);

  configureQuickActionEdgeTool({ bind, isBound });
  configureQuickActionProviders({ bind });
  configureColorQuickActionProviders({ bind, isBound });
  configureTypeQuickActionProviders({ bind, isBound });
  configureIconQuickActionProviders({ bind, isBound });
});

export function configureQuickActionEdgeTool(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(QuickActionEdgeCreationTool).toSelf().inSingletonScope();
  context.bind(TYPES.ITool).toService(QuickActionEdgeCreationTool);
  configureActionHandler(context, QuickActionTriggerEdgeCreationAction.KIND, QuickActionEdgeCreationTool);
}

export function configureQuickActionProviders(context: { bind: interfaces.Bind }): void {
  context.bind(IVY_TYPES.QuickActionProvider).to(DeleteQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(InfoQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(ConnectQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(AutoAlignQuickActionProvider);

  context.bind(IVY_TYPES.QuickActionProvider).to(CreateEventQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(CreateGatewayQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(CreateActivityQuickActionProvider);
  context.bind(IVY_TYPES.QuickActionProvider).to(CreateAllElementsQuickActionProvider);
}

export function configureColorQuickActionProviders(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(ColorPaletteHandler).toSelf().inSingletonScope();
  context.bind(IVY_TYPES.ColorPalette).toService(ColorPaletteHandler);
  context.bind(IVY_TYPES.QuickActionProvider).to(SelectColorQuickActionProvider);
}

export function configureIconQuickActionProviders(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(IconPaletteHandler).toSelf().inSingletonScope();
  context.bind(IVY_TYPES.IconPalette).toService(IconPaletteHandler);
  context.bind(IVY_TYPES.QuickActionProvider).to(SelectIconQuickActionProvider);
}

export function configureTypeQuickActionProviders(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(TypesPaletteHandler).toSelf().inSingletonScope();
  context.bind(IVY_TYPES.ActivityTypesPalette).toService(TypesPaletteHandler);
  context.bind(IVY_TYPES.QuickActionProvider).to(SelectActivityTypeQuickActionProvider);
}

export default ivyQuickActionModule;
