import { ElementMessageAction } from '@axonivy/process-editor-protocol';
import {
  bindAsService,
  configureActionHandler,
  EndProgressAction,
  FeatureModule,
  MessageAction,
  StartProgressAction,
  StatusAction,
  TYPES,
  UpdateProgressAction
} from '@eclipse-glsp/client';
import { NotificationToaster } from './notification-toaster';

export const ivyNotificationModule = new FeatureModule((bind, unbind, isBound, rebind) => {
  const context = { bind, unbind, isBound, rebind };
  bindAsService(context, TYPES.IUIExtension, NotificationToaster);
  configureActionHandler(context, StatusAction.KIND, NotificationToaster);
  configureActionHandler(context, MessageAction.KIND, NotificationToaster);
  configureActionHandler(context, StartProgressAction.KIND, NotificationToaster);
  configureActionHandler(context, UpdateProgressAction.KIND, NotificationToaster);
  configureActionHandler(context, EndProgressAction.KIND, NotificationToaster);
  configureActionHandler(context, ElementMessageAction.KIND, NotificationToaster);
});

export const NotificationToasterId = NotificationToaster.ID;
