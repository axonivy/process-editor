import { JumpAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import {
  Action,
  EditorContextService,
  GLSPAbstractUIExtension,
  type IActionDispatcher,
  type IActionHandler,
  SelectionService,
  SetModelAction,
  SetUIExtensionVisibilityAction,
  TYPES,
  UpdateModelAction
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { createElement, createIcon } from '../utils/ui-utils';
import { t } from 'i18next';

@injectable()
export class JumpOutUi extends GLSPAbstractUIExtension implements IActionHandler {
  static readonly ID = 'jumpOutUi';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(SelectionService) protected selectionService: SelectionService;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;

  id(): string {
    return JumpOutUi.ID;
  }

  containerClass(): string {
    return 'jump-out-container';
  }

  override initializeContents(containerElement: HTMLElement): void {
    containerElement.style.position = 'absolute';
  }

  override onBeforeShow(containerElement: HTMLElement) {
    containerElement.innerHTML = '';
    const button = createElement('button', ['jump-out-btn']);
    button.title = t('tool.jumpOut', { hotkey: 'J' });
    button.appendChild(createIcon(IvyIcons.JumpOut));
    button.onclick = () => this.actionDispatcher.dispatch(JumpAction.create({ elementId: '' }));
    containerElement.appendChild(button);
  }

  handle(action: Action): void {
    if (SetModelAction.is(action) || UpdateModelAction.is(action)) {
      this.actionDispatcher.dispatch(
        SetUIExtensionVisibilityAction.create({ extensionId: JumpOutUi.ID, visible: this.showJumpOutBtn(action.newRoot.id) })
      );
    }
  }

  showJumpOutBtn(id: string): boolean {
    return id.includes('-');
  }
}
