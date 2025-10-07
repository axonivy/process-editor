import { CustomIconToggleActionHandler } from '@axonivy/process-editor';
import { CustomIconToggleAction } from '@axonivy/process-editor-protocol';
import { configureActionHandler, FeatureModule } from '@eclipse-glsp/client';

export const ivyCustomIconModule = new FeatureModule((bind, _unbind, isBound) => {
  const context = { bind, isBound };
  bind(CustomIconToggleActionHandler).toSelf().inSingletonScope();
  configureActionHandler(context, CustomIconToggleAction.KIND, CustomIconToggleActionHandler);
});
