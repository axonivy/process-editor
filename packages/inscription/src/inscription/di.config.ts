import './inscription-ui.css';

import { IVY_TYPES } from '@axonivy/process-editor';
import { SwitchThemeAction } from '@axonivy/process-editor-protocol';
import {
  FeatureModule,
  OpenAction,
  RedoAction,
  TYPES,
  UndoAction,
  UpdateModelAction,
  bindAsService,
  configureActionHandler
} from '@eclipse-glsp/client';
import { EnableInscriptionAction, ToggleInscriptionAction } from './action';
import { InscriptionUi } from './inscription-ui';
import { OpenInscriptionKeyListener, OpenInscriptionMouseListener } from './open-inscription-listener';
import { InscriptionButtonProvider } from './tool-bar';
import { IvyInscriptionGlobalKeyListenerTool } from './key-listener';

const ivyInscriptionModule = new FeatureModule((bind, _unbind, isBound) => {
  bindAsService(bind, TYPES.IUIExtension, InscriptionUi);
  configureActionHandler({ bind, isBound }, EnableInscriptionAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, ToggleInscriptionAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, OpenAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, SwitchThemeAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, UndoAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, RedoAction.KIND, InscriptionUi);
  configureActionHandler({ bind, isBound }, UpdateModelAction.KIND, InscriptionUi);
  bind(TYPES.KeyListener).to(OpenInscriptionKeyListener);
  bind(TYPES.MouseListener).to(OpenInscriptionMouseListener);
  bind(IVY_TYPES.ToolBarButtonProvider).to(InscriptionButtonProvider);
  bindAsService({ bind }, TYPES.IDefaultTool, IvyInscriptionGlobalKeyListenerTool);
});

export default ivyInscriptionModule;
