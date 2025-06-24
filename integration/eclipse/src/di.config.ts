import {
  createIvyDiagramContainer,
  IVY_ACCESSIBILITY_MODULES,
  ivyBreakpointModule,
  ivyGoToSourceModule,
  ivyOpenDataClassModule,
  ivyOpenDecoratorBrowserModule,
  ivyOpenFormModule,
  ivyStartActionModule,
  ivyThemeModule
} from '@axonivy/process-editor';
import type { Container } from 'inversify';

import { ivyInscriptionModule } from '@axonivy/process-editor-inscription';
import ivyEclipseCopyPasteModule from './invoke-actions/copy-paste/di.config';
import ivyEclipseDeleteModule from './invoke-actions/delete/di.config';
import ivyOpenQuickOutlineModule from './open-quick-outline/di.config';
import type { IDiagramOptions } from '@eclipse-glsp/client';
import { createDiagramOptionsModule, standaloneExportModule } from '@eclipse-glsp/client';
import type { ThemeMode } from '@axonivy/process-editor-protocol';
import { ivyStartupDiagramModule as ivyStartupDiagramModule } from './startup';
import ivyEclipseSelectAllModule from './invoke-actions/select/di.config';

export interface IvyDiagramOptions extends IDiagramOptions {
  theme: ThemeMode;
  showGrid: boolean;
}

export default function createContainer(widgetId: string, options: IvyDiagramOptions): Container {
  const container = createIvyDiagramContainer(
    widgetId,
    createDiagramOptionsModule(options),
    ivyThemeModule,
    ivyEclipseCopyPasteModule,
    ivyEclipseDeleteModule,
    ivyEclipseSelectAllModule,
    ivyOpenDecoratorBrowserModule,
    ivyOpenQuickOutlineModule,
    ivyGoToSourceModule,
    ivyBreakpointModule,
    ivyStartActionModule,
    ivyOpenDataClassModule,
    ivyOpenFormModule,
    ivyInscriptionModule,
    ivyStartupDiagramModule,
    standaloneExportModule,
    ...IVY_ACCESSIBILITY_MODULES
  );

  return container;
}
