import { IVY_TYPES } from '@axonivy/process-editor';
import { ContainerModule } from 'inversify';
import { SearchProcessCallersActionProvider, StarProcessQuickActionProvider } from './actions';

const ivyEditorActionModule = new ContainerModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(StarProcessQuickActionProvider);
  bind(IVY_TYPES.QuickActionProvider).to(SearchProcessCallersActionProvider);
});

export default ivyEditorActionModule;
