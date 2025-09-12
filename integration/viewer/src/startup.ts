import { EnableViewportAction, MoveIntoViewportAction, SetViewportZoomAction, SwitchThemeAction } from '@axonivy/process-editor-protocol';
import type { Action, IActionDispatcher, IDiagramStartup } from '@eclipse-glsp/client';
import { CenterAction, NavigationTarget, SelectAction, TYPES } from '@eclipse-glsp/client';
import type { interfaces } from 'inversify';
import { ContainerModule, inject, injectable } from 'inversify';
import type { IvyDiagramOptions } from './di.config';

const ContainerSymbol = Symbol('ContainerSymbol');

@injectable()
export class ViewerDiagramStartup implements IDiagramStartup {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher!: IActionDispatcher;
  @inject(TYPES.IDiagramOptions) protected options!: IvyDiagramOptions;
  @inject(ContainerSymbol) protected container!: interfaces.Container;

  async preRequestModel() {
    this.actionDispatcher.dispatch(SwitchThemeAction.create({ theme: this.options.theme }));
  }

  async postModelInitialization(): Promise<void> {
    if (this.isNumeric(this.options.zoom)) {
      this.actionDispatcher.dispatch(SetViewportZoomAction.create({ zoom: +this.options.zoom / 100 }));
      this.showElement((ids: string[]) => CenterAction.create(ids, { animate: false, retainZoom: true }));
    } else {
      this.showElement((ids: string[]) => MoveIntoViewportAction.create({ elementIds: ids, animate: false, retainZoom: true }));
    }
    if (!this.options.previewMode) {
      this.actionDispatcher.dispatch(EnableViewportAction.create());
    }
  }

  protected showElement(action: (elementIds: string[]) => Action) {
    if (this.options.highlight) {
      this.actionDispatcher.dispatch(action([this.options.highlight]));
    }
    if (this.options.select) {
      const elementIds = this.options.select.split(NavigationTarget.ELEMENT_IDS_SEPARATOR);
      this.actionDispatcher.dispatch(SelectAction.create({ selectedElementsIDs: elementIds }));
      this.actionDispatcher.dispatch(action(elementIds));
    }
  }

  protected isNumeric(number: string) {
    const num = parseFloat(number);
    return !isNaN(num) && isFinite(num);
  }
}

export const ivyStartupDiagramModule = new ContainerModule(bind => {
  bind(TYPES.IDiagramStartup)
    .toDynamicValue(ctx => {
      const child = ctx.container.createChild();
      child.bind(ViewerDiagramStartup).toSelf().inSingletonScope();
      child.bind(ContainerSymbol).toConstantValue(ctx.container);
      return child.get(ViewerDiagramStartup);
    })
    .inSingletonScope();
});
