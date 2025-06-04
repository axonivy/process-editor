import { createIvyDiagramContainer, ivyStandaloneCopyPasteModule, ivyThemeModule } from '@axonivy/process-editor';
import { ivyInscriptionModule } from '@axonivy/process-editor-inscription';
import type { IDiagramOptions } from '@eclipse-glsp/client';
import { createDiagramOptionsModule, standaloneExportModule, standaloneSelectModule, undoRedoModule } from '@eclipse-glsp/client';
import type { Container } from 'inversify';
import ivyStandaloneBreakpointModule from './breakpoint/di.config';
import ivyDirtyStateModule from './dirty-state/di.config';
import ivyNavigationModule from './navigate/di.config';
import type { ThemeMode } from '@axonivy/process-editor-protocol';
import type { InscriptionContext } from '@axonivy/process-editor-inscription-protocol';
import { ivyStartupDiagramModule } from './startup';

export interface IvyDiagramOptions extends IDiagramOptions {
  select: string | null;
  theme: ThemeMode;
  inscriptionContext: InscriptionContext & { server: string };
}

export default function createContainer(options: IvyDiagramOptions): Container {
  const container = createIvyDiagramContainer(
    'sprotty',
    createDiagramOptionsModule(options),
    // standalone modules
    standaloneSelectModule,
    standaloneExportModule,
    undoRedoModule,
    ivyStandaloneBreakpointModule,
    ivyStandaloneCopyPasteModule,
    ivyThemeModule,

    // ivyNavigationModule is a replacement for navigationModule but it is already removed in the default IvyDiagramContainer
    ivyNavigationModule,
    ivyDirtyStateModule,
    ivyInscriptionModule,
    ivyStartupDiagramModule
  );
  return container;
}
