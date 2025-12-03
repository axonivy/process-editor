import { PaletteItem, RequestContextActions, SetContextActions, TYPES, type IActionDispatcher } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

@injectable()
export class TypesPaletteHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  getPaletteItems() {
    return () =>
      new Promise<Array<PaletteItem>>(resolve => {
        this.actionDispatcher
          .request(RequestContextActions.create({ contextId: 'ivy-tool-activity-type-palette', editorContext: { selectedElementIds: [] } }))
          .then(response => {
            if (SetContextActions.is(response)) {
              resolve(response.actions.map(e => e as PaletteItem));
            }
          });
      });
  }
}
