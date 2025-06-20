import {
  bindAsService,
  configureActionHandler,
  DefaultResizeKeyListener,
  DefaultResizeKeyTool,
  elementNavigationModule,
  EnableKeyboardGridAction,
  FeatureModule,
  FocusDomAction,
  HideToastAction,
  keyboardControlModule,
  KeyboardGrid,
  type ModuleConfiguration,
  ResizeElementAction,
  ResizeKeyListener,
  ResizeKeyTool,
  resizeModule,
  searchPaletteModule,
  ShowToastMessageAction,
  standaloneShortcutsModule,
  toastModule,
  TYPES,
  viewKeyToolsModule,
  ZoomFactors
} from '@eclipse-glsp/client';
import { FocusDomActionHandler } from './focus-dom-handler';
import { IvyGlobalKeyListenerTool } from './key-listener/global-keylistener-tool';
import { JumpOutKeyListener } from './key-listener/jump-out';
import { QuickActionKeyListener } from './key-listener/quick-actions';
import './key-shortcut/accessible-key-shortcut.css';
import { IvyResizeElementHandler } from './resize-key-tool/resize-key-handler';
import { IvySearchAutocompletePalette } from './search/search-palette';
import { IvySearchAutocompletePaletteTool } from './search/search-tool';
import { IvyToast } from './toast/toast-tool';
import { translateMessages } from '../translation/glsp-messages';

translateMessages();
ZoomFactors.DEFAULT.in = 1.1;
ZoomFactors.DEFAULT.out = 0.9;

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
    // fully customized
    bindAsService(context, TYPES.IUIExtension, IvySearchAutocompletePalette);
    bindAsService(context, TYPES.IDefaultTool, IvySearchAutocompletePaletteTool);
  },
  { featureId: searchPaletteModule.featureId }
);

export const ivyKeyboardControlModule = new FeatureModule(
  (bind, unbind, isBound, rebind) => {
    const context = { bind, unbind, isBound, rebind };
    // custom GlobalKeyListenerTool
    bindAsService(context, TYPES.IDefaultTool, IvyGlobalKeyListenerTool);

    // only use keyboard grid but skip other extensions and tools
    bindAsService(context, TYPES.IUIExtension, KeyboardGrid);
    configureActionHandler(context, EnableKeyboardGridAction.KIND, KeyboardGrid);
  },
  { featureId: keyboardControlModule.featureId }
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
  { add: ivySearchPaletteModule }, // instead of: searchPaletteModule
  { add: ivyKeyboardControlModule }, // instead of: keyboardControlModule
  { add: ivyToastModule }, // instead of: toastModule
  { add: viewKeyToolsModule }, // standard accessibility module
  { add: elementNavigationModule }, // standard accessibility module
  { add: standaloneShortcutsModule }, // standard accessibility module
  { add: ivyKeyListenerModule }, // custom extension
  { add: ivyDomFocusModule } // custom extension
  // unused: { add: focusTrackerModule }
  // unused: { add: keyboardToolPaletteModule }
];
