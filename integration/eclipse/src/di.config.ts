import { keepAliveModule } from '@eclipse-glsp/ide';
import { ivyBreakpointModule, createIvyDiagramContainer, ivyThemeModule, IvyGLSPDiagramServer } from '@axonivy/process-editor';
import { Container } from 'inversify';
import { ConsoleLogger, LogLevel, TYPES } from '@eclipse-glsp/client';

import ivyOpenInscriptionModule from './open-inscription/di.config';
import ivyOpenDecoratorBrowserModule from './open-decorator-browser/di.config';
import ivyOpenQuickOutlineModule from './open-quick-outline/di.config';
import ivyGoToSourceModule from './edit-source/di.config';
import ivyEditorActionModule from './editor-action/di.config';
import ivyOpenDataClassModule from './open-data-class/di.config';
import ivyToolBarModule from './tool-bar/di.config';
import ivyEclipseCopyPasteModule from './copy-paste/di.config';
import ivyEclipseDeleteModule from './invoke-delete/di.config';

export default function createContainer(widgetId: string): Container {
  const container = createIvyDiagramContainer(widgetId);
  container.bind(TYPES.ModelSource).to(IvyGLSPDiagramServer).inSingletonScope();
  container.rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  container.rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

  container.load(keepAliveModule);
  // Revert after Issue 690 is merged
  container.load(ivyEclipseCopyPasteModule);
  // Revert after Issue 690 is merged
  container.load(ivyEclipseDeleteModule);
  container.load(ivyOpenInscriptionModule);
  container.load(ivyOpenDecoratorBrowserModule);
  container.load(ivyOpenQuickOutlineModule);
  container.load(ivyGoToSourceModule);
  container.load(ivyBreakpointModule);
  container.load(ivyEditorActionModule);
  container.load(ivyOpenDataClassModule);
  container.load(ivyToolBarModule);
  container.load(ivyThemeModule);

  return container;
}
