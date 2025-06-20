import type { ContainerConfiguration, IHelperLineOptions } from '@eclipse-glsp/client';
import {
  ConsoleLogger,
  DEFAULT_ALIGNABLE_ELEMENT_FILTER,
  GLSPCenterGridSnapper,
  LogLevel,
  MarqueeUtil,
  TYPES,
  baseViewModule,
  bindOrRebind,
  contextMenuModule,
  copyPasteModule,
  gridModule,
  helperLineModule,
  hoverModule,
  initializeDiagramContainer,
  navigationModule,
  overrideViewerOptions,
  statusModule
} from '@eclipse-glsp/client';
import { Container } from 'inversify';
import ivyAnimateModule from './animate/di.config';
import ivyConnectorModule from './connector/di.config';
import ivyDecorationModule from './decorator/di.config';
import ivyDiagramModule from './diagram/di.config';
import { LaneNode } from './diagram/model';
import { ivyLabelEditModule, ivyLabelEditUiModule } from './edit-label/di.config';
import ivyExecutionModule from './execution/di.config';
import { IvyGLSPCommandStack } from './ivy-command-stack';
import ivyJumpModule from './jump/di.config';
import ivyLaneModule from './lanes/di.config';
import { ivyNotificationModule } from './ui-tools/notification/di.config';
import type { IvyViewerOptions } from './options';
import { defaultIvyViewerOptions } from './options';
import { ivyChangeBoundsToolModule, ivyExportModule, ivySelectModule } from './tools/di.config';
import { IVY_TYPES } from './types';
import ivyQuickActionModule from './ui-tools/quick-action/di.config';
import ivyToolBarModule from './ui-tools/tool-bar/di.config';
import ivyViewportModule from './ui-tools/viewport/di.config';
import ivyWrapModule from './wrap/di.config';
import ivyZorderModule from './zorder/di.config';

import './colors.css';
import { ivyCopyPasteModule } from './copy-paste/di.config';

export default function createContainer(widgetId: string, ...containerConfiguration: ContainerConfiguration): Container {
  const container = initializeDiagramContainer(
    new Container(),
    // removals: not needed defaults
    { remove: [hoverModule, navigationModule, statusModule, contextMenuModule, copyPasteModule] },

    // GLSP additions: optional modules from GLSP
    baseViewModule,
    helperLineModule,
    gridModule,

    // replacements:
    // ensure that replacements have the same featureId as the original modules to properly handle
    // dependencies/requirements between modules as otherwise some other modules might not be loaded
    { replace: ivyViewportModule },
    { replace: ivyDecorationModule },
    { replace: ivyZorderModule },
    { replace: ivyToolBarModule },
    { replace: ivyLabelEditModule },
    { replace: ivyLabelEditUiModule },
    { replace: ivyChangeBoundsToolModule },
    { replace: ivyExportModule },
    { replace: ivySelectModule },
    ivyCopyPasteModule,

    // Ivy additions
    ivyDiagramModule,
    ivyQuickActionModule,
    ivyWrapModule,
    ivyJumpModule,
    ivyLaneModule,
    ivyAnimateModule,
    ivyExecutionModule,
    ivyConnectorModule,
    ivyNotificationModule,

    // additional configurations
    ...containerConfiguration
  );

  // configurations
  bindOrRebind(container, TYPES.Grid).toConstantValue({ x: 8, y: 8 });
  container.bind<IvyViewerOptions>(IVY_TYPES.IvyViewerOptions).toConstantValue(defaultIvyViewerOptions());
  container.bind<IHelperLineOptions>(TYPES.IHelperLineOptions).toConstantValue({
    alignmentElementFilter: element => !(element instanceof LaneNode) && DEFAULT_ALIGNABLE_ELEMENT_FILTER(element)
  });

  bindOrRebind(container, MarqueeUtil).to(MarqueeUtil).inSingletonScope();
  bindOrRebind(container, TYPES.IMarqueeBehavior).toConstantValue({ entireEdge: true, entireElement: true });
  bindOrRebind(container, TYPES.ICommandStack).to(IvyGLSPCommandStack).inSingletonScope();
  bindOrRebind(container, TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  bindOrRebind(container, TYPES.LogLevel).toConstantValue(LogLevel.warn);
  bindOrRebind(container, TYPES.ISnapper).to(GLSPCenterGridSnapper);

  overrideViewerOptions(container, {
    baseDiv: widgetId,
    hiddenDiv: widgetId + '_hidden'
  });

  return container;
}
