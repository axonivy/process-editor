import { ElementChangedAction, MoveIntoViewportAction } from '@axonivy/process-editor-protocol';
import { toast, Toaster } from '@axonivy/ui-components';
import {
  Action,
  EndProgressAction,
  type IActionDispatcher,
  type IActionHandler,
  isWithEditableLabel,
  MessageAction,
  OpenAction,
  SelectAction,
  type SeverityLevel,
  StartProgressAction,
  StatusAction,
  TYPES,
  UpdateProgressAction
} from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import React from 'react';
import { currentTheme } from '../../theme/current-theme';
import { ReactUIExtension } from '../../utils/react-ui-extension';

type ToasterType = SeverityLevel | 'LOADING';

@injectable()
export class NotificationToaster extends ReactUIExtension implements IActionHandler {
  static readonly ID = 'ivy-notification-toaster';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;

  private messageToast?: string | number;
  private progressMessages = new Map<string, string>();

  id(): string {
    return NotificationToaster.ID;
  }

  containerClass(): string {
    return NotificationToaster.ID;
  }

  protected initializeContainer(container: HTMLElement): void {
    super.initializeContainer(container);
    container.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  protected render(): React.ReactNode {
    return <Toaster theme={currentTheme()} position='bottom-left' closeButton={true} />;
  }

  handle(action: Action) {
    if (StatusAction.is(action)) {
      console.debug(`[${action.severity}]: ${action.message}`);
    }
    if (MessageAction.is(action)) {
      return this.updateToast(action.message, action.severity);
    }
    if (StartProgressAction.is(action)) {
      return this.updateToast(this.progress(action), 'LOADING');
    }
    if (UpdateProgressAction.is(action)) {
      return this.updateToast(this.progress(action), 'LOADING');
    }
    if (EndProgressAction.is(action)) {
      return this.updateToast(this.progress(action), 'NONE');
    }
    if (ElementChangedAction.is(action)) {
      return this.updateToast(this.elementChangedMessage(action), 'INFO', {
        action: {
          label: t('message.elementOpen'),
          onClick: () =>
            this.actionDispatcher.dispatchAll([
              SelectAction.create({ selectedElementsIDs: [action.elementId], deselectedElementsIDs: true }),
              MoveIntoViewportAction.create({ elementIds: [action.elementId] }),
              OpenAction.create(action.elementId)
            ])
        }
      });
    }
  }

  private progress(action: StartProgressAction | UpdateProgressAction | EndProgressAction): string {
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

  private updateToast(text: string, type: ToasterType, options?: Parameters<(typeof toast)['info']>[1]): void {
    toast.dismiss(this.messageToast);
    if (type !== 'NONE') {
      this.messageToast = this.createToast(type)(text, options);
    }
  }

  private createToast(type: ToasterType) {
    switch (type) {
      case 'ERROR':
        return toast.error;
      case 'WARNING':
        return toast.warning;
      case 'INFO':
        return toast.info;
      case 'LOADING':
        return toast.loading;
      default:
        return toast.success;
    }
  }

  private elementChangedMessage(action: ElementChangedAction): string {
    const element = this.editorContext.modelRoot.index.getById(action.elementId);
    let elementName = action.elementId.substring(action.elementId.indexOf('-') + 1);
    if (element && isWithEditableLabel(element) && element.editableLabel?.text) {
      elementName = element.editableLabel.text;
    }
    switch (action.changeKind) {
      case 'UNDO':
        return t('message.elementUndo', { elementName });
      case 'REDO':
        return t('message.elementRedo', { elementName });
    }
  }
}
