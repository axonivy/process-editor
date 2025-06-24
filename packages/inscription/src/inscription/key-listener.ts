import { IvyGlobalKeyListenerTool } from '@axonivy/process-editor';
import { FocusDomAction, matchesKeystroke, type ShortcutRegistration } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { ToggleInscriptionAction } from './action';

@injectable()
export class IvyInscriptionGlobalKeyListenerTool extends IvyGlobalKeyListenerTool {
  static TOKEN = Symbol.for(IvyInscriptionGlobalKeyListenerTool.name);

  get id(): string {
    return 'glsp.global-inscription-key-listener';
  }

  protected shortcutRegistrationsToken(): symbol {
    return IvyInscriptionGlobalKeyListenerTool.TOKEN;
  }

  protected override shortcutRegistrations(): ShortcutRegistration[] {
    return [
      {
        shortcuts: ['3'],
        description: t('a11y.hotkeyDesc.focusInscription'),
        group: t('a11y.hotkeyGroup.inscription'),
        position: 0
      }
    ];
  }

  protected override handleKeyEvent(event: KeyboardEvent) {
    if (this.isInput(event) || !this.matchesSetFocusOnInscription(event)) {
      return [];
    }
    const selector = '#inscription-ui .ui-inscription-tabs-list button';
    const focusAction = FocusDomAction.create(selector);
    if (document.querySelector<HTMLElement>(selector)?.checkVisibility()) {
      return [focusAction];
    }
    return [ToggleInscriptionAction.create({}), focusAction];
  }

  protected matchesSetFocusOnInscription(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Digit3') || matchesKeystroke(event, 'Numpad3');
  }
}
