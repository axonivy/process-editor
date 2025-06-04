import { FeatureModule, InvokeCopyPasteAction, TYPES, configureActionHandler } from '@eclipse-glsp/client';
import { CopyPasteKeyListener } from './copy-paste';
import { InvokeCopyPasteActionHandler } from './copy-paste-handler';
import { CopyPasteTool } from './copy-paste-tool';

const ivyCopyPasteModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(TYPES.KeyListener).to(CopyPasteKeyListener);
  configureActionHandler({ bind, isBound }, InvokeCopyPasteAction.KIND, InvokeCopyPasteActionHandler);

  bind(CopyPasteTool).toSelf().inSingletonScope();
  bind(TYPES.IVNodePostprocessor).toService(CopyPasteTool);
});

export default ivyCopyPasteModule;

// document.addEventListener('copy', event => {
//   event.preventDefault();
//   event.clipboardData.setData('text/plain', 'COPY ME!!!');
//   event.clipboardData.setData('text/html', '<p>COPY ME!!!</p>');
// });
