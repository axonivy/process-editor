import {
  PaletteItem,
  RequestContextActions,
  SetContextActions,
  TYPES,
  type GModelElement,
  type IActionDispatcher
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { elementIcons } from '../../../diagram/icon/icons';

@injectable()
export class IconPaletteHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  getPaletteItems(element: GModelElement) {
    return () =>
      new Promise<Array<PaletteItem>>(resolve => {
        this.actionDispatcher
          .request(RequestContextActions.create({ contextId: 'ivy-tool-icon-palette', editorContext: { selectedElementIds: [] } }))
          .then(response => {
            if (SetContextActions.is(response)) {
              const paletteItems = response.actions.map(e => e as PaletteItem);
              const defaultIcon = paletteItems.find(item => item.id === 'default')?.children?.find(child => child.id === 'default');
              if (defaultIcon) {
                defaultIcon.icon = elementIcons[element.type] || '';
              }
              resolve(paletteItems);
            }
          });
      });
  }
}
