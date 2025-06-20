import { repeatOnMessagesUpdated, messages } from '@eclipse-glsp/client';
import { ViewportKeyTool } from '@eclipse-glsp/client/lib/features/viewport/viewport-tool';
import { t } from 'i18next';
import { injectable } from 'inversify';

@injectable()
export class IvyViewportKeyTool extends ViewportKeyTool {
  override enable(): void {
    super.enable();
    this.toDisposeOnDisable.push(
      repeatOnMessagesUpdated(() =>
        this.shortcutManager.register(TOKEN, [
          {
            shortcuts: ['M'],
            description: t('a11y.hotkeyDesc.center'),
            group: messages.shortcut.group_move,
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
