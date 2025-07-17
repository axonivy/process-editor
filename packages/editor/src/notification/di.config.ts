import {
  EndProgressAction,
  FeatureModule,
  MessageAction,
  StartProgressAction,
  UpdateProgressAction,
  configureActionHandler,
  StatusAction
} from '@eclipse-glsp/client';
import { ElementChangedAction } from '@axonivy/process-editor-protocol';
import { ToastNotificationService } from './notification-service';

export const ivyNotificationModule = new FeatureModule((bind, unbind, isBound, rebind) => {
  const context = { bind, unbind, isBound, rebind };
  bind(ToastNotificationService).toSelf().inSingletonScope();
  configureActionHandler(context, StatusAction.KIND, ToastNotificationService);
  configureActionHandler(context, MessageAction.KIND, ToastNotificationService);
  configureActionHandler(context, StartProgressAction.KIND, ToastNotificationService);
  configureActionHandler(context, UpdateProgressAction.KIND, ToastNotificationService);
  configureActionHandler(context, EndProgressAction.KIND, ToastNotificationService);
  configureActionHandler(context, ElementChangedAction.KIND, ToastNotificationService);
});
