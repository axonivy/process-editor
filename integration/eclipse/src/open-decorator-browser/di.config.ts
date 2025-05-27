import { IVY_TYPES } from '@axonivy/process-editor';
import { ContainerModule } from 'inversify';
import { CustomIconQuickActionProvider } from './quick-action';

const ivyOpenDecoratorBrowserModule = new ContainerModule(bind => {
  bind(IVY_TYPES.QuickActionProvider).to(CustomIconQuickActionProvider);
});

export default ivyOpenDecoratorBrowserModule;
