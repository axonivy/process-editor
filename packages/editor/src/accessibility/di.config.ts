import {
  DefaultResizeKeyListener,
  DefaultResizeKeyTool,
  DeselectKeyTool,
  FeatureModule,
  FocusDomAction,
  HideToastAction,
  type ModuleConfiguration,
  ResizeElementAction,
  ResizeKeyListener,
  ResizeKeyTool,
  ShowToastMessageAction,
  TYPES,
  bindAsService,
  configureActionHandler,
  elementNavigationModule,
  resizeModule,
  searchPaletteDefaultSuggestionsModule,
  searchPaletteModule,
  standaloneSearchPaletteModule,
  standaloneShortcutsModule,
  toastModule,
  viewKeyToolsModule
} from '@eclipse-glsp/client';
import { translateMessages } from '../translation/glsp-messages';
import { FocusDomActionHandler } from './focus-dom-handler';
import { IvyGlobalKeyListenerTool } from './key-listener/global-keylistener-tool';
import { JumpOutKeyListener } from './key-listener/jump-out';
import { QuickActionKeyListener } from './key-listener/quick-actions';
import './key-shortcut/accessible-key-shortcut.css';
import { IvyResizeElementHandler } from './resize-key-tool/resize-key-handler';
import {
  IvySearchAutocompletePalette,
  RevealEdgeElementAutocompleteSuggestionProvider,
  RevealNodeAutocompleteSuggestionProvider
} from './search/search-palette';
import { IvyToast } from './toast/toast-tool';

translateMessages();

export const ivyResizeModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // custom resize element handler
    bind(IvyResizeElementHandler).toSelf().inSingletonScope();
    configureActionHandler(context, ResizeElementAction.KIND, IvyResizeElementHandler);

    // bindings below are part of the standaloneResizeModule in GLSP, we merge them here for convenience
    bindAsService(context, TYPES.IDefaultTool, DefaultResizeKeyTool);
    context.bind(DefaultResizeKeyListener).toSelf();
    bindAsService(context, TYPES.ITool, ResizeKeyTool);
    context.bind(ResizeKeyListener).toSelf();
  },
  {
    featureId: resizeModule.featureId
  }
);

export const ivySearchPaletteModule = new FeatureModule(
  (bind, _unbind, isBound, rebind) => {
    const context = { bind, isBound, rebind };
    // custom search palette (skips deselecting all elements on show)
    bindAsService(context, TYPES.IUIExtension, IvySearchAutocompletePalette);
  },
  { featureId: searchPaletteModule.featureId }
);

export const ivySearchPaletteDefaultSuggestionsModule = new FeatureModule(
  (bind, _unbind, isBound, rebind) => {
    const context = { bind, isBound, rebind };
    // custom suggestion providers (Ivy icons and types)
    bindAsService(context, TYPES.IAutocompleteSuggestionProvider, RevealNodeAutocompleteSuggestionProvider);
    bindAsService(context, TYPES.IAutocompleteSuggestionProvider, RevealEdgeElementAutocompleteSuggestionProvider);
  },
  { featureId: searchPaletteDefaultSuggestionsModule.featureId }
);

export const ivyToastModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // fully customized
    configureActionHandler(context, ShowToastMessageAction.KIND, IvyToast);
    configureActionHandler(context, HideToastAction.KIND, IvyToast);
  },
  { featureId: toastModule.featureId }
);

export const ivyViewKeyToolsModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // no grid support
    bindAsService(context, TYPES.IDefaultTool, DeselectKeyTool);
  },
  { featureId: viewKeyToolsModule.featureId }
);

export const ivyGlobalListenerModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    bindAsService(context, TYPES.IDefaultTool, IvyGlobalKeyListenerTool);
  },
  { featureId: Symbol('ivy-global-key-listener') }
);

export const ivyKeyListenerModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    context.bind(TYPES.KeyListener).to(QuickActionKeyListener);
    context.bind(TYPES.KeyListener).to(JumpOutKeyListener);
  },
  { featureId: Symbol('ivy-key-listener') }
);

export const ivyDomFocusModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    configureActionHandler(context, FocusDomAction.KIND, FocusDomActionHandler);
  },
  { featureId: Symbol('ivy-dom-focus') }
);

export const IVY_ACCESSIBILITY_MODULES: ModuleConfiguration[] = [
  { replace: ivyResizeModule }, // instead of: resizeModule
  { replace: ivySearchPaletteModule }, // instead of: searchPaletteModule
  { replace: ivySearchPaletteDefaultSuggestionsModule }, // instead of: searchPaletteDefaultSuggestionsModule
  { add: standaloneSearchPaletteModule }, // standard key listener (Ctrl+F / Cmd+F)
  { add: ivyToastModule }, // instead of: toastModule
  { add: ivyViewKeyToolsModule }, // instead of: viewKeyToolsModule
  { add: elementNavigationModule }, // standard accessibility module
  { add: standaloneShortcutsModule }, // standard accessibility module
  { add: ivyKeyListenerModule }, // custom extension
  { add: ivyDomFocusModule }, // custom extension
  { add: ivyGlobalListenerModule } // custom extension
  // unused: { add: viewKeyToolsModule } // we do not want any Grid view
  // unused: { add: keyboardControlModule } // we do not want any keyboard or Grid control
  // unused: { add: focusTrackerModule }
  // unused: { add: keyboardToolPaletteModule }
];
