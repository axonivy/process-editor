import { updateMessages } from '@eclipse-glsp/client';
import i18n, { t } from 'i18next';

const doTranslateMessages = () => {
  updateMessages({
    autocomplete: {
      no_suggestions: t('a11y.autocomplete.noSuggestions') // BaseAutocompletePalette
    },
    diagram: {
      label: t('a11y.diagram.label') // GLSPProjectionView, aria-label
    },
    // focus: {
    //   focus_not_set: messages.focus.focus_not_set, // FocusTrackerTool (via focusTrackerModule), not used in our tool
    //   focus_on: messages.focus.focus_on, // FocusTrackerTool (via focusTrackerModule), not used in our tool
    //   focus_off: undefined, // Unused by both GLSP and our tool
    //   focus_within: messages.focus.within, // FocusTrackerTool (via focusTrackerModule), not used in our tool
    //   shortcut_focus_graph: messages.focus.shortcut_focus_graph, // GlobalKeyListenerTool, ALT+G, not used, we have IvyGlobalKeyListenerTool
    //   shortcut_focus_palette: messages.focus.shortcut_focus_palette // GlobalKeyListenerTool, ALT+P, not used, we have IvyGlobalKeyListenerTool
    // },
    // grid: {
    //   shortcut_zoom_in: messages.grid.shortcut_zoom_in, // GridCellZoomTool (previously: ZoomKeyListener), CTRL++
    //   zoom_in_grid: messages.grid.zoom_in_grid // GridCellZoomTool (previously: ZoomKeyListener), toast message
    // },
    move: {
      shortcut_move: t('a11y.hotkeyDesc.move') // ChangeBoundsTool (previously: MoveKeyListener, combined as 'element or viewport'), ⬅ ⬆ ➡ ⬇
    },
    navigation: {
      default_navigation_mode_activated: t('a11y.navigation.on'), // ElementNavigatorKeyListener
      default_navigation_mode_deactivated: t('a11y.navigation.off'), // ElementNavigatorKeyListener
      local_navigation_mode_activated: t('a11y.navigation.onPosition'), // ElementNavigatorKeyListener
      local_navigation_mode_deactivated: t('a11y.navigation.offPosition'), // ElementNavigatorKeyListener
      shortcut_local_mode: t('a11y.hotkeyDesc.navigationActivatePosition'), // ElementNavigatorTool (previously: ElementNavigatorKeyListener), ALT+N
      shortcut_global_mode: t('a11y.hotkeyDesc.navigationActivate') // ElementNavigatorTool (previously: ElementNavigatorKeyListener), N
    },
    resize: {
      resize_mode_activated: t('a11y.resize.on'), // ResizeKeyListener
      resize_mode_deactivated: t('a11y.resize.off'), // ResizeKeyListener
      shortcut_activate: t('a11y.hotkeyDesc.resizeActivate'), // DefaultResizeKeyTool (previously: ResizeKeyListener), ALT+A
      shortcut_deactivate: t('a11y.hotkeyDesc.resizeDeactivate'), // ResizeKeyTool (previously: ResizeKeyListener), Escape
      shortcut_increase: t('a11y.hotkeyDesc.resizeIncrease'), // ResizeKeyTool (previously: ResizeKeyListener), +
      shortcut_decrease: t('a11y.hotkeyDesc.resizeDecrease'), // ResizeKeyTool (previously: ResizeKeyListener), -
      shortcut_reset: t('a11y.hotkeyDesc.resizeDefault') // ResizeKeyTool (previously: ResizeKeyListener), Ctrl+0
    },
    search: {
      label: t('a11y.search.label'), // SearchAutocompletePaletteTool, aria-label
      placeholder: t('a11y.search.placeholder'), // SearchAutocompletePaletteTool, placeholder
      shortcut_activate: t('a11y.hotkeyDesc.searchPalette') // SearchAutocompletePaletteTool, CTRL+F
    },
    shortcut: {
      //   group_focus: undefined, // unused by GLSP
      //   group_graph: undefined, // GlobalKeyListenerTool, not used, we have IvyGlobalKeyListenerTool
      //   group_grid: undefined, // unused by GLSP
      group_move: t('a11y.hotkeyGroup.move'), // ChangeBoundsTool (previously: MoveKeyListener), ViewportKeyTool (previously: MoveKeyListener)
      group_navigation: t('a11y.hotkeyGroup.navigation'), // ElementNavigatorTool (previously: ElementNavigatorKeyListener)
      group_search: t('a11y.hotkeyGroup.search'), // SearchAutocompletePaletteTool
      group_resize: t('a11y.hotkeyGroup.resize'), // DefaultResizeKeyTool (previously: ResizeKeyListener), ResizeKeyTool (previously: ResizeKeyListener)
      //   group_tool_palette: undefined, // GlobalKeyListenerTool, not used, we have IvyGlobalKeyListenerTool
      //   group_viewport: undefined, // unused by GLSP
      group_zoom: t('a11y.hotkeyGroup.viewport'), // GridCellZoomTool (previously: ZoomKeyListener), ViewportKeyTool (previously: ZoomKeyListener)
      header_command: t('a11y.ui.command'), // AvailableShortcutsUIExtension (previously: KeyShortcutUIExtension)
      header_shortcut: t('a11y.ui.keybinding'), // AvailableShortcutsUIExtension (previously: KeyShortcutUIExtension)
      menu_title: t('a11y.ui.menuTitle'), // AvailableShortcutsUIExtension (previously: KeyShortcutUIExtension)
      title: t('a11y.ui.title') // AvailableShortcutsUIExtension (previously: KeyShortcutUIExtension)
    },
    // tool_palette: {
    //   debug_mode_button: undefined, // ToolPalette, not used, we have ToolBar
    //   delete_button: undefined, // ToolPalette, KeyboardToolPalette, not used, we have ToolBar
    //   label: undefined, // ToolPalette, KeyboardToolPalette, not used, we have ToolBar
    //   marquee_button: undefined, // ToolPalette, KeyboardToolPalette, not used, we have ToolBar
    //   marquee_message: undefined, // KeyboardToolPalette, not used, we have ToolBar
    //   maximize: undefined, // ToolPalette, not used, we have ToolBar
    //   minimize: undefined, // ToolPalette, not used, we have ToolBar
    //   no_items: undefined, // ToolPalette, KeyboardToolPalette, not used, we have ToolBar
    //   reset_viewport_button: undefined, // ToolPalette, not used, we have ToolBar
    //   search_button: undefined, // ToolPalette, KeyboardToolPalette, not used, we have ToolBar
    //   search_placeholder: undefined, // ToolPalette, KeyboardToolPalette, not used, we have ToolBar
    //   selection_button: undefined, // ToolPalette, KeyboardToolPalette, not used, we have ToolBar
    //   toggle_grid_button: undefined, // ToolPalette, not used, we have ToolBar
    //   validate_button: undefined // ToolPalette, KeyboardToolPalette, not used, we have ToolBar
    // },
    viewport: {
      // shortcut_move_viewport: t('a11y.hotkeyDesc.move'), // ViewportKeyTool (previously: MoveKeyListener, combined as 'element or viewport'), ⬅ ⬆ ➡ ⬇
      shortcut_zoom_element: t('a11y.hotkeyDesc.zoom') // ViewportKeyTool (previously: ZoomKeyListener, separate as '+' and '-' but combined as 'element or viewport'), +-
      // shortcut_zoom_viewport: t('a11y.hotkeyDesc.zoom') // ViewportKeyTool (previously ZoomKeyListener, separate as '+' and '-' but combined as 'element or viewport'), +-
    }
  });
};

export const translateMessages = () => {
  if (i18n.isInitialized) {
    doTranslateMessages();
  } else {
    i18n.on('initialized', () => doTranslateMessages());
  }
};
