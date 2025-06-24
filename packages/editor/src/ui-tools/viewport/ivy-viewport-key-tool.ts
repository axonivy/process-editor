import { repeatOnMessagesUpdated, messages } from '@eclipse-glsp/client';
import { ViewportKeyTool } from '@eclipse-glsp/client/lib/features/viewport/viewport-tool';
import { t } from 'i18next';
import { injectable } from 'inversify';

@injectable()
export class IvyViewportKeyTool extends ViewportKeyTool {
  override enable(): void {
    this.toDisposeOnDisable.push(
      this.keyTool.registerListener(this.moveKeyListener),
      this.keyTool.registerListener(this.zoomKeyListener),

      repeatOnMessagesUpdated(() =>
        this.shortcutManager.register(TOKEN, [
          // We unify the shortcuts for zooming (+ -) and moving (⬅ ⬆ ➡ ⬇) the viewport or element
          // Move shortcut (⬅ ⬆ ➡ ⬇) is already registered by the change bounds tool
          {
            shortcuts: ['+ -'],
            description: messages.viewport.shortcut_zoom_element,
            group: messages.shortcut.group_zoom,
            position: 0
          },
          {
            shortcuts: ['M'],
            description: t('a11y.hotkeyDesc.center'),
            group: messages.shortcut.group_zoom,
            position: 0
          },
          {
            shortcuts: ['O'],
            description: t('a11y.hotkeyDesc.origin'),
            group: messages.shortcut.group_zoom,
            position: 0
          },
          {
            shortcuts: ['F'],
            description: t('a11y.hotkeyDesc.fitToScreen'),
            group: messages.shortcut.group_zoom,
            position: 0
          }
        ])
      )
    );
  }
}

const TOKEN = Symbol.for('ivy.viewport-key-tool');
