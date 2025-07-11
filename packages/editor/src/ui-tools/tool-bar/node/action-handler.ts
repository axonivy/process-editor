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
import { ToolBar } from '../tool-bar';

@injectable()
export class ElementsPaletteHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;

  protected paletteItems: Array<PaletteItem> = [];
  protected extensionItems: Promise<Array<PaletteItem>>;

  getPaletteItems(): PaletteItem[] {
    return this.paletteItems;
  }

  async getExtensionItems() {
    if (!this.extensionItems) {
      this.extensionItems = new Promise(resolve => {
        this.actionDispatcher
          .request(RequestContextActions.create({ contextId: 'ivy-tool-extensions-palette', editorContext: { selectedElementIds: [] } }))
          .then(response => {
            if (SetContextActions.is(response)) {
              resolve(response.actions.map(e => e as PaletteItem));
            }
          });
      });
    }
    return this.extensionItems;
  }

  handle(action: Action) {
    if (UpdatePaletteItems.is(action)) {
      this.updateElementPalette();
    }
  }

  private async updateElementPalette(): Promise<void> {
    this.actionDispatcher
      .request(RequestContextActions.create({ contextId: ToolBar.ID, editorContext: { selectedElementIds: [] } }))
      .then(response => {
        if (SetContextActions.is(response)) {
          this.paletteItems = response.actions.map(e => e as PaletteItem);
        }
      });
  }
}
