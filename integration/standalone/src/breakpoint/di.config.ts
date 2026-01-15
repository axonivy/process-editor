import { SetBreakpointAction, ToggleBreakpointAction } from '@axonivy/process-editor-protocol';
import { FeatureModule, configureActionHandler } from '@eclipse-glsp/client';
import { StandaloneShowBreakpointActionHandler } from './action-handler';

const ivyStandaloneBreakpointModule = new FeatureModule((bind, _unbind, isBound) => {
  bind(StandaloneShowBreakpointActionHandler).toSelf().inSingletonScope();
  configureActionHandler({ bind, isBound }, SetBreakpointAction.KIND, StandaloneShowBreakpointActionHandler);
  configureActionHandler({ bind, isBound }, ToggleBreakpointAction.KIND, StandaloneShowBreakpointActionHandler);
});

export default ivyStandaloneBreakpointModule;
