import {
  isMac,
  matchesKeystroke,
  messages,
  repeatOnMessagesUpdated,
  SearchAutocompletePaletteKeyListener,
  SearchAutocompletePaletteTool
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvySearchAutocompletePaletteTool extends SearchAutocompletePaletteTool {
  // customization: listener with changed activate keystroke
  protected readonly keyListener: SearchAutocompletePaletteKeyListener = new IvySearchAutocompletePaletteKeyListener(this);

  enable(): void {
    this.toDisposeOnDisable.push(
      this.keyTool.registerListener(this.keyListener),
      repeatOnMessagesUpdated(() =>
        this.shortcutManager.register(SearchAutocompletePaletteTool.TOKEN, [
          {
            shortcuts: [isMac() ? 'CMD' : 'CTRL', 'F'], // customization: Add Mac support with 'CMD'
            description: messages.search.shortcut_activate,
            group: messages.shortcut.group_search,
            position: 0
          }
        ])
      )
    );
  }
}

export class IvySearchAutocompletePaletteKeyListener extends SearchAutocompletePaletteKeyListener {
  protected matchesSearchActivateKeystroke(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'KeyF', 'ctrlCmd'); // customization: use 'ctrlCmd' instead of 'ctrl'
  }
}
