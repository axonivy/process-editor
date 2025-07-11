import {
  ExportSvgCommand,
  ExportSvgPostprocessor,
  FeatureModule,
  GResizeHandle,
  HideChangeBoundsToolResizeFeedbackCommand,
  SelectAllCommand,
  SelectCommand,
  SelectFeedbackCommand,
  ShowChangeBoundsToolResizeFeedbackCommand,
  TYPES,
  bindAsService,
  changeBoundsToolModule,
  configureCommand,
  configureView,
  exportModule,
  selectModule
} from '@eclipse-glsp/client';

import { IvyResizeHandleView } from '../diagram/views';
import { IvySvgExporter } from './export/ivy-svg-exporter';
import './helper-line.css';
import { IvyChangeBoundsManager } from './ivy-change-bounds-manager';
import { IvyChangeBoundsTool } from './ivy-change-bounds-tool';
import { IvySelectMouseListener } from './select-mouse-listener';

export const ivyChangeBoundsToolModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // GSLP defaults
    configureCommand(context, ShowChangeBoundsToolResizeFeedbackCommand);
    configureCommand(context, HideChangeBoundsToolResizeFeedbackCommand);

    // GLSP replacements
    bindAsService(context, TYPES.IChangeBoundsManager, IvyChangeBoundsManager);
    bindAsService(context, TYPES.IDefaultTool, IvyChangeBoundsTool);
    configureView(context, GResizeHandle.TYPE, IvyResizeHandleView);
  },
  { featureId: changeBoundsToolModule.featureId }
);

export const ivyExportModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    const context = { bind, isBound };
    // GLSP defaults
    bindAsService(context, TYPES.HiddenVNodePostprocessor, ExportSvgPostprocessor);
    configureCommand(context, ExportSvgCommand);

    // GLSP replacements
    bindAsService(context, TYPES.SvgExporter, IvySvgExporter);
  },
  { featureId: exportModule.featureId }
);

export const ivySelectModule = new FeatureModule(
  (bind, _unbind, isBound) => {
    const context = { bind, isBound };
    // GLSP defaults
    configureCommand(context, SelectCommand);
    configureCommand(context, SelectAllCommand);
    configureCommand(context, SelectFeedbackCommand);

    // GLSP replacements
    bindAsService(context, TYPES.MouseListener, IvySelectMouseListener);
  },
  { featureId: selectModule.featureId }
);
