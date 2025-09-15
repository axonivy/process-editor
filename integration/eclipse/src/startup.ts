import type { ToolBar } from '@axonivy/process-editor';
import { IVY_TYPES } from '@axonivy/process-editor';
import { EnableInscriptionAction } from '@axonivy/process-editor-inscription';
import { EnableViewportAction, SwitchThemeAction, UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import type { IActionDispatcher, IDiagramStartup } from '@eclipse-glsp/client';
import { EnableToolPaletteAction, ShowGridAction, TYPES } from '@eclipse-glsp/client';
import { ContainerModule, inject, injectable } from 'inversify';
import type { IvyDiagramOptions } from './di.config';

import './index.css';

@injectable()
export class EclipseDiagramStartup implements IDiagramStartup {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher!: IActionDispatcher;
  @inject(IVY_TYPES.ToolBar) protected toolBar!: ToolBar;
  @inject(TYPES.IDiagramOptions) protected options!: IvyDiagramOptions;

  async preRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(EnableToolPaletteAction.create());
    this.actionDispatcher.dispatch(EnableViewportAction.create());
    this.actionDispatcher.dispatch(SwitchThemeAction.create({ theme: this.options.theme }));
  }

  async postRequestModel(): Promise<void> {}

  async postModelInitialization(): Promise<void> {
    this.actionDispatcher.dispatch(ShowGridAction.create({ show: this.options.showGrid }));
    this.actionDispatcher.dispatch(UpdatePaletteItems.create());
    this.actionDispatcher.dispatch(EnableInscriptionAction.create({}));
  }
}

export const ivyStartupDiagramModule = new ContainerModule(bind => {
  bind(TYPES.IDiagramStartup).to(EclipseDiagramStartup).inSingletonScope();
});
