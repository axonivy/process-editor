import './edit-label.css';

import {
  ApplyLabelEditCommand,
  EditLabelAction,
  FeatureModule,
  TYPES,
  bindAsService,
  configureActionHandler,
  configureCommand,
  labelEditModule,
  labelEditUiModule
} from '@eclipse-glsp/client';
import { IVY_TYPES } from '../types';
import { IvyDirectLabelEditTool } from './edit-label-tool';
import { IvyEditLabelActionHandler, IvyEditLabelUI } from './edit-label-ui';
import { EditLabelActionProvider } from './quick-action';

export const ivyLabelEditModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    // GLSP defaults
    configureCommand({ bind, isBound }, ApplyLabelEditCommand);
    // bind(TYPES.IEditLabelValidator).to(ServerEditLabelValidator);
    // bind(TYPES.IEditLabelValidationDecorator).to(BalloonLabelValidationDecorator);

    // GLSP replacements
    bindAsService(bind, TYPES.IDefaultTool, IvyDirectLabelEditTool);

    // Ivy extensions
    bind(IVY_TYPES.QuickActionProvider).to(EditLabelActionProvider);
  },
  { featureId: labelEditModule.featureId }
);

export const ivyLabelEditUiModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    const context = { bind, isBound };

    // GLSP replacements
    configureActionHandler(context, EditLabelAction.KIND, IvyEditLabelActionHandler);
    bindAsService(context, TYPES.IUIExtension, IvyEditLabelUI);
  },
  { featureId: labelEditUiModule.featureId }
);
