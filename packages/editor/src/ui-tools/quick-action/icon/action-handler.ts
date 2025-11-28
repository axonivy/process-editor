import { UpdateIconPaletteAction, UpdatePaletteItems } from '@axonivy/process-editor-protocol';
import {
  Action,
  PaletteItem,
  RequestContextActions,
  SetContextActions,
  TYPES,
  type GModelElement,
  type IActionDispatcher,
  type IActionHandler
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { elementIcons } from '../../../diagram/icon/icons';
import { ShowQuickActionMenuAction } from '../quick-action-menu-ui';

@injectable()
export class IconPaletteHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  protected paletteItems: PaletteItem[] = [];

  getPaletteItems(element: GModelElement): PaletteItem[] {
    const defaultIcon = this.paletteItems.find(item => item.id === 'default')?.children?.find(child => child.id === 'default');
    if (defaultIcon) {
      defaultIcon.icon = elementIcons[element.type] || '';
    }
    return this.paletteItems;
  }

  handle(action: Action) {
    if (UpdatePaletteItems.is(action)) {
      this.updateIconPalette();
    }
    if (UpdateIconPaletteAction.is(action)) {
      this.paletteItems = action.paletteItems;
      this.actionDispatcher.dispatch(ShowQuickActionMenuAction.empty());
    }
  }

  private async updateIconPalette(): Promise<void> {
    this.actionDispatcher
      .request(RequestContextActions.create({ contextId: 'ivy-tool-icon-palette', editorContext: { selectedElementIds: [] } }))
      .then(response => {
        if (SetContextActions.is(response)) {
          this.paletteItems = response.actions.map(e => e as PaletteItem);
        }
      });
  }
}
