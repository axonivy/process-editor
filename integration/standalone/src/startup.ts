import { EnableInscriptionAction } from '@axonivy/process-editor-inscription';
import { EnableViewportAction, SwitchThemeAction, UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import type { IActionDispatcher, IDiagramStartup } from '@eclipse-glsp/client';
import { EnableToolPaletteAction, NavigationTarget, SelectAction, TYPES } from '@eclipse-glsp/client';
import { ContainerModule, inject, injectable } from 'inversify';
import type { IvyDiagramOptions } from './di.config';
import './index.css';

@injectable()
export class StandaloneDiagramStartup implements IDiagramStartup {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher!: IActionDispatcher;
  @inject(TYPES.IDiagramOptions) protected options!: IvyDiagramOptions;

  async preRequestModel(): Promise<void> {
    this.actionDispatcher.dispatch(EnableToolPaletteAction.create());
    this.actionDispatcher.dispatch(EnableViewportAction.create());
    this.actionDispatcher.dispatch(SwitchThemeAction.create({ theme: this.options.theme }));
  }

  async postModelInitialization(): Promise<void> {
    this.actionDispatcher.dispatch(UpdatePaletteItems.create());
    this.actionDispatcher.dispatch(
      EnableInscriptionAction.create({
        connection: { server: this.options.inscriptionContext.server },
        inscriptionContext: this.options.inscriptionContext
      })
    );
    if (this.options.select) {
      const elementIds = this.options.select.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
      this.actionDispatcher.dispatch(SelectAction.create({ selectedElementsIDs: elementIds }));
    }
  }
}

export const ivyStartupDiagramModule = new ContainerModule(bind => {
  bind(TYPES.IDiagramStartup).to(StandaloneDiagramStartup).inSingletonScope();
});
