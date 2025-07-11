import { FeatureModule, TYPES } from '@eclipse-glsp/client';
import { IVY_TYPES } from '../types';
import { OpenDataClassKeyListener } from './key-listener';
import { OpenFormQuickActionProvider } from './quick-action';
import { OpenFormEditorButtonProvider } from './toolbar-button';

const ivyOpenFormModule = new FeatureModule(bind => {
  bind(TYPES.KeyListener).to(OpenDataClassKeyListener);
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenFormEditorButtonProvider);
  bind(IVY_TYPES.QuickActionProvider).to(OpenFormQuickActionProvider);
});

export default ivyOpenFormModule;
