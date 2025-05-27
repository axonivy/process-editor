import { ContainerModule } from 'inversify';
import { IVY_TYPES } from '@axonivy/process-editor';
import { InscribeProcessButtonProvider, OpenDataClassButtonProvider, OpenInsertExtensionButtonProvider } from './button';

const ivyToolBarModule = new ContainerModule(bind => {
  bind(IVY_TYPES.ToolBarButtonProvider).to(InscribeProcessButtonProvider);
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenDataClassButtonProvider);
  bind(IVY_TYPES.ToolBarButtonProvider).to(OpenInsertExtensionButtonProvider);
});

export default ivyToolBarModule;
