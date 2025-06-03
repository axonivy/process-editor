import { FeatureModule, configureActionHandler } from '@eclipse-glsp/client';

import { IvyEclipseCopyPasteActionHandler } from './copy-paste';

const ivyEclipseCopyPasteModule = new FeatureModule((bind, _unbind, isBound) => {
  configureActionHandler({ bind, isBound }, 'invoke-copy', IvyEclipseCopyPasteActionHandler);
  configureActionHandler({ bind, isBound }, 'invoke-cut', IvyEclipseCopyPasteActionHandler);
  configureActionHandler({ bind, isBound }, 'invoke-paste', IvyEclipseCopyPasteActionHandler);
});

export default ivyEclipseCopyPasteModule;
