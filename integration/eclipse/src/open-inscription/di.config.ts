import { IVY_TYPES } from '@axonivy/process-editor';
import { ContainerModule } from 'inversify';
import { configureActionHandler, TYPES } from '@eclipse-glsp/client';
import { OpenAction } from 'sprotty-protocol';

import { OpenInscriptionMouseListener } from './mouse-listener';
import { OpenInscriptionActionHandler, OpenInscriptionKeyListener } from './open-inscription-handler';
import { InscribeQuickActionProvider } from './quick-action';

const ivyOpenInscriptionModule = new ContainerModule((bind, _unbind, isBound) => {
  bind(TYPES.KeyListener).to(OpenInscriptionKeyListener);
  configureActionHandler({ bind, isBound }, OpenAction.KIND, OpenInscriptionActionHandler);
  bind(IVY_TYPES.QuickActionProvider).to(InscribeQuickActionProvider);
  bind(TYPES.MouseListener).to(OpenInscriptionMouseListener);
});

export default ivyOpenInscriptionModule;
