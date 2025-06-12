import {
  Action,
  EndProgressAction,
  type IActionDispatcher,
  type IActionHandler,
  MessageAction,
  type SeverityLevel,
  StartProgressAction,
  TYPES,
  UpdateProgressAction
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import React from 'react';
import { ReactUIExtension } from '../../utils/react-ui-extension';
import { toast, Toaster } from '@axonivy/ui-components';
import { currentTheme } from '../../theme/current-theme';

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

  private updateToast(text: string, severity: SeverityLevel | 'LOADING'): void {
    toast.dismiss(this.messageToast);
    if (severity !== 'NONE') {
      this.messageToast = this.createToast(severity)(text);
    }
  }

  private createToast(severity: SeverityLevel | 'LOADING') {
    switch (severity) {
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
}
