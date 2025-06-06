import { bindAsService, CopyPasteStartup, FeatureModule, LocalClipboardService, TYPES } from '@eclipse-glsp/client';
import { IvyServerCopyPasteHandler } from './copy-paste-handler';

export const ivyCopyPasteModule = new FeatureModule(
  bind => {
    bind(TYPES.ICopyPasteHandler).to(IvyServerCopyPasteHandler);
    bind(TYPES.IAsyncClipboardService).to(LocalClipboardService).inSingletonScope();
  },
  { featureId: Symbol('copyPaste') }
);

export const ivyStandaloneCopyPasteModule = new FeatureModule(
  bind => {
    bindAsService(bind, TYPES.IDiagramStartup, CopyPasteStartup);
    bind(TYPES.IGModelRootListener).toService(CopyPasteStartup);
  },
  {
    featureId: Symbol('standaloneCopyPaste'),
    requires: ivyCopyPasteModule
  }
);
