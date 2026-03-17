import { FeatureModule, TYPES, configureActionHandler } from '@eclipse-glsp/client';
import { SetDirtyStateAction, SetDirtyStateActionHandler } from './action-handler';
import { SaveListener } from './save';

const ivyDirtyStateModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(SetDirtyStateActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, SetDirtyStateAction.KIND, SetDirtyStateActionHandler);
  bind(TYPES.KeyListener).to(SaveListener);
});

export default ivyDirtyStateModule;
