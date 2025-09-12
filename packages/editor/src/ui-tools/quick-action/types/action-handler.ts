import { UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import {
  Action,
  PaletteItem,
  RequestContextActions,
  SetContextActions,
  TYPES,
  type IActionDispatcher,
  type IActionHandler
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

@injectable()
export class TypesPaletteHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  protected paletteItems: PaletteItem[] = [];

  getPaletteItems(): PaletteItem[] {
    return this.paletteItems;
  }

  handle(action: Action) {
    if (UpdatePaletteItems.is(action)) {
      this.updateActivityTypePalette();
    }
  }

  private async updateActivityTypePalette(): Promise<void> {
    this.actionDispatcher
      .request(RequestContextActions.create({ contextId: 'ivy-tool-activity-type-palette', editorContext: { selectedElementIds: [] } }))
      .then(response => {
        if (SetContextActions.is(response)) {
          this.paletteItems = response.actions.map(e => e as PaletteItem);
        }
      });
  }
}
