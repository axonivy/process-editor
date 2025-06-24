import './viewport-bar.css';

import { EnableViewportAction, SetViewportZoomAction } from '@axonivy/process-editor-protocol';
import {
  bindAsService,
  configureActionHandler,
  configureCommand,
  EnableDefaultToolsAction,
  EnableToolsAction,
  FeatureModule,
  GetViewportCommand,
  MoveViewportAction,
  MoveViewportHandler,
  MoveViewportKeyListener,
  RepositionCommand,
  SetViewportAction,
  SetViewportCommand,
  TYPES,
  viewportModule,
  ZoomAction,
  ZoomFactors,
  ZoomHandler,
  ZoomKeyListener
} from '@eclipse-glsp/client';
import { IvyViewportKeyTool } from './ivy-viewport-key-tool';
import { IvyZoomKeyListener } from './ivy-zoom-key-listener';
import { IvyScrollMouseListener } from './scroll';
import { ViewportBar } from './viewport-bar';
import {
  IvyCenterCommand,
  IvyFitToScreenCommand,
  IvySetViewportZoomCommand,
  MoveIntoViewportCommand,
  OriginViewportCommand
} from './viewport-commands';
import { IvyZoomMouseListener } from './zoom';

ZoomFactors.DEFAULT.in = 1.1;
ZoomFactors.DEFAULT.out = 0.9;

const ivyViewportModule = new FeatureModule(
  (bind, _unbind, isBound, rebind) => {
    const context = { bind, isBound, rebind };

    // GLSP defaults
    configureCommand(context, GetViewportCommand);
    configureCommand(context, SetViewportCommand);
    configureCommand(context, RepositionCommand);

    bind(TYPES.ZoomFactors).toConstantValue(ZoomFactors.DEFAULT);

    bind(MoveViewportHandler).toSelf().inSingletonScope();
    bind(MoveViewportKeyListener).toSelf();
    configureActionHandler(context, MoveViewportAction.KIND, MoveViewportHandler);
    bind(ZoomHandler).toSelf().inSingletonScope();
    configureActionHandler(context, ZoomAction.KIND, ZoomHandler);

    // GLSP replacements
    configureCommand(context, IvyCenterCommand);
    configureCommand(context, IvyFitToScreenCommand);
    configureCommand(context, OriginViewportCommand);
    bindAsService(context, TYPES.MouseListener, IvyZoomMouseListener);

    bind(IvyScrollMouseListener).toSelf().inSingletonScope();
    configureActionHandler(context, EnableToolsAction.KIND, IvyScrollMouseListener);
    configureActionHandler(context, EnableDefaultToolsAction.KIND, IvyScrollMouseListener);

    bindAsService(context, TYPES.IDefaultTool, IvyViewportKeyTool);
    bind(ZoomKeyListener).to(IvyZoomKeyListener);

    // Ivy extensions
    bindAsService(context, TYPES.IUIExtension, ViewportBar);
    configureActionHandler(context, EnableViewportAction.KIND, ViewportBar);
    configureActionHandler(context, SetViewportAction.KIND, ViewportBar);
    configureActionHandler(context, SetViewportZoomAction.KIND, ViewportBar);

    configureCommand(context, MoveIntoViewportCommand);
    configureCommand(context, IvySetViewportZoomCommand);
  },
  { featureId: viewportModule.featureId }
);

export default ivyViewportModule;
