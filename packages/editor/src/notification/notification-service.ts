import { ElementChangedAction, MoveIntoViewportAction } from '@axonivy/process-editor-protocol';
import {
  Action,
  EndProgressAction,
  type IActionHandler,
  MessageAction,
  StartProgressAction,
  UpdateProgressAction,
  type SeverityLevel,
  StatusAction,
  isWithEditableLabel,
  EditorContextService,
  TYPES,
  type IActionDispatcher,
  SelectAction,
  OpenAction
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import Toastify from 'toastify-js';

@injectable()
export class ToastNotificationService implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;

  private duration = 2000;
  private messageToast?: ReturnType<typeof Toastify>;
  private progressMessages = new Map<string, string>();

  handle(action: Action) {
    if (StatusAction.is(action)) {
      console.debug(`[${action.severity}]: ${action.message}`);
    }
    if (MessageAction.is(action)) {
      return this.updateToast(action.message, action.severity);
    }
    if (StartProgressAction.is(action)) {
      return this.updateToast(this.progress(action), 'INFO');
    }
    if (UpdateProgressAction.is(action)) {
      return this.updateToast(this.progress(action), 'INFO');
    }
    if (EndProgressAction.is(action)) {
      return this.updateToast(this.progress(action), 'NONE');
    }
    if (ElementChangedAction.is(action)) {
      return this.updateToast(this.elementChangedMessage(action), 'INFO', () =>
        this.actionDispatcher.dispatchAll([
          SelectAction.create({ selectedElementsIDs: [action.elementId], deselectedElementsIDs: true }),
          MoveIntoViewportAction.create({ elementIds: [action.elementId] }),
          OpenAction.create(action.elementId)
        ])
      );
    }
  }

  protected progress(action: StartProgressAction | UpdateProgressAction | EndProgressAction): string {
    if (StartProgressAction.is(action)) {
      this.progressMessages.set(action.progressId, action.title);
    }
    let message = this.progressMessages.get(action.progressId) ?? '';
    if (action.message) {
      message += message.length > 0 ? `${message}: ${action.message}` : action.message;
    }
    const percentage = EndProgressAction.is(action) ? undefined : action.percentage;
    if (percentage && percentage > 0) {
      message += message.length > 0 ? `${message} (${percentage}%)` : `${percentage}%`;
    }
    if (EndProgressAction.is(action)) {
      this.progressMessages.delete(action.progressId);
    }
    return message;
  }

  protected message(action: MessageAction): void {
    this.messageToast?.hideToast();
    if (action.severity !== 'NONE') {
      this.messageToast = this.createToast(action.message, action.severity);
      this.messageToast.showToast();
    }
  }

  protected updateToast(text: string, severity: SeverityLevel, onClick?: () => void): void {
    this.messageToast?.hideToast();
    if (severity !== 'NONE') {
      this.messageToast = this.createToast(text, severity, onClick);
      this.messageToast.showToast();
    }
  }

  protected createToast(text: string, severity: SeverityLevel, onClick?: () => void) {
    return Toastify({
      text,
      close: true,
      gravity: 'bottom',
      position: 'left',
      className: `severity-${severity}`,
      duration: severity === 'ERROR' ? undefined : this.duration,
      onClick
    });
  }

  private elementChangedMessage(action: ElementChangedAction): string {
    const element = this.editorContext.modelRoot.index.getById(action.elementId);
    let elementName = action.elementId.substring(action.elementId.indexOf('-') + 1);
    if (element && isWithEditableLabel(element) && element.editableLabel?.text) {
      elementName = element.editableLabel.text;
    }

    switch (action.changeKind) {
      case 'UNDO':
        return `Undo configuration in: ${elementName} (Click to open element)`;
      case 'REDO':
        return `Redo configuration in: ${elementName} (Click to open element)`;
    }
  }
}
