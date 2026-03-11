import { EnableHistoryAction, ShowHistoryAction } from '@axonivy/process-editor-protocol';
import { FeatureModule, SetViewportAction, TYPES, bindAsService, configureActionHandler } from '@eclipse-glsp/client';
import { HistoryUi } from './history-ui';
import './history-ui.css';

const ivyHistoryModule = new FeatureModule((bind, _unbind, isBound) => {
  bindAsService(bind, TYPES.IUIExtension, HistoryUi);
  configureActionHandler({ bind, isBound }, EnableHistoryAction.KIND, HistoryUi);
  configureActionHandler({ bind, isBound }, ShowHistoryAction.KIND, HistoryUi);
  configureActionHandler({ bind, isBound }, SetViewportAction.KIND, HistoryUi);
});

export default ivyHistoryModule;
