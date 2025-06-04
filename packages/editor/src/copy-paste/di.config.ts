import { bindAsService, CopyPasteStartup, FeatureModule, LocalClipboardService, TYPES } from '@eclipse-glsp/client';
import { IvyServerCopyPasteHandler } from './copy-paste-handler';

export const ivyCopyPasteModule = new FeatureModule(
  bind => {
    // bind(TYPES.KeyListener).to(CopyPasteKeyListener);
    // configureActionHandler({ bind, isBound }, InvokeCopyPasteAction.KIND, InvokeCopyPasteActionHandler);

    // bind(CopyPasteTool).toSelf().inSingletonScope();
    // bind(TYPES.IVNodePostprocessor).toService(CopyPasteTool);
    bind(TYPES.ICopyPasteHandler).to(IvyServerCopyPasteHandler);
    bind(TYPES.IAsyncClipboardService).to(LocalClipboardService).inSingletonScope();
  },
  { featureId: Symbol('copyPaste') }
);

// document.addEventListener('copy', event => {
//   event.preventDefault();
//   event.clipboardData.setData('text/plain', 'COPY ME!!!');
//   event.clipboardData.setData('text/html', '<p>COPY ME!!!</p>');
// });

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
