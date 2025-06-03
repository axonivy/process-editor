import { FeatureModule, configureActionHandler } from '@eclipse-glsp/client';

import { InvokeSelectAllAction, IvyInvokeSelectAllActionHandler } from './select';

const ivyEclipseSelectAllModule = new FeatureModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, InvokeSelectAllAction.KIND, IvyInvokeSelectAllActionHandler);
});

export default ivyEclipseSelectAllModule;
