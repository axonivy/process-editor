import './tool-bar.css';

import {
  bindAsService,
  configureActionHandler,
  EnableDefaultToolsAction,
  EnableToolPaletteAction,
  FeatureModule,
  toolPaletteModule,
  TYPES
} from '@eclipse-glsp/client';
import type { interfaces } from 'inversify';
import { IVY_TYPES } from '../../types';

import { CustomIconToggleAction, UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import { OptionsButtonProvider } from './button';
import { ElementsPaletteHandler } from './node/action-handler';
import {
  ActivitiesButtonProvider,
  AllElementsButtonProvider,
  ArtifactsButtonProvider,
  EventsButtonProvider,
  ExtensionButtonProvider,
  GatewaysButtonProvider
} from './node/button';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { CustomIconToggleActionHandler } from './options/action-handler';
import { ToolBar, ToolBarFocusMouseListener } from './tool-bar';
import { ShowToolBarMenuAction } from './tool-bar-menu';

const ivyToolBarModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    const context = { bind, isBound };
    // Ivy extensions
    bindAsService(context, IVY_TYPES.ToolBar, ToolBar);
    bind(TYPES.IUIExtension).toService(ToolBar);

    configureActionHandler(context, EnableToolPaletteAction.KIND, ToolBar);
    configureActionHandler(context, ShowToolBarMenuAction.KIND, ToolBar);
    configureActionHandler(context, ShowToolBarOptionsMenuAction.KIND, ToolBar);
    configureToolBarButtons(context);

    bindAsService(context, TYPES.MouseListener, ToolBarFocusMouseListener);

    bind(CustomIconToggleActionHandler).toSelf().inSingletonScope();
    configureActionHandler(context, CustomIconToggleAction.KIND, CustomIconToggleActionHandler);

    // GLSP replacements
    configureActionHandler(context, EnableDefaultToolsAction.KIND, ToolBar);
    configureActionHandler(context, UpdatePaletteItems.KIND, ToolBar);
  },
  { featureId: toolPaletteModule.featureId }
);

function configureToolBarButtons(context: { bind: interfaces.Bind; isBound: interfaces.IsBound }): void {
  context.bind(ElementsPaletteHandler).toSelf().inSingletonScope();
  configureActionHandler(context, UpdatePaletteItems.KIND, ElementsPaletteHandler);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(AllElementsButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(EventsButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(GatewaysButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(ActivitiesButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(ArtifactsButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(ExtensionButtonProvider);
  context.bind(IVY_TYPES.ToolBarButtonProvider).to(OptionsButtonProvider);
}

export default ivyToolBarModule;
