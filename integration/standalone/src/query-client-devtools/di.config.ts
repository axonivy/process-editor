import { configureActionHandler, FeatureModule, SetModelAction, TYPES } from '@eclipse-glsp/client';
import { QueryDevTools } from './query-client-devtools';

export const ivyReactQueryDevToolsModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(QueryDevTools).toSelf().inSingletonScope();
  bind(TYPES.IUIExtension).toService(QueryDevTools);
  configureActionHandler({ bind, isBound }, SetModelAction.KIND, QueryDevTools);
});
