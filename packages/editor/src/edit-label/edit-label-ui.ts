import { Action, EditLabelUI, type IActionHandler, isEditLabelAction, SetUIExtensionVisibilityAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyEditLabelActionHandler implements IActionHandler {
  handle(action: Action) {
    if (isEditLabelAction(action)) {
      return SetUIExtensionVisibilityAction.create({
        extensionId: IvyEditLabelUI.IVY_ID,
        visible: true,
        contextElementsId: [action.labelId]
      });
    }
    return;
  }
}

@injectable()
export class IvyEditLabelUI extends EditLabelUI {
  static readonly IVY_ID = 'ivyEditLabelUi';

  public override id(): string {
    return IvyEditLabelUI.IVY_ID;
  }

  protected override configureAndAdd(element: HTMLInputElement | HTMLTextAreaElement, containerElement: HTMLElement): void {
    super.configureAndAdd(element, containerElement);
    element.style.top = '3px';
    element.style.zIndex = '10000';
  }
}
