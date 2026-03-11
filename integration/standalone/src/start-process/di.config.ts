import { IVY_TYPES, StarProcessQuickActionProvider } from '@axonivy/process-editor';
import { StartProcessAction } from '@axonivy/process-editor-protocol';
import { configureActionHandler, FeatureModule } from '@eclipse-glsp/client';
import { StartProcessActionHandler } from './action-handler';

const ivyStandaloneStartProcessModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(IVY_TYPES.QuickActionProvider).to(StarProcessQuickActionProvider);
  configureActionHandler({ bind, isBound }, StartProcessAction.KIND, StartProcessActionHandler);
});

export default ivyStandaloneStartProcessModule;
