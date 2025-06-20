import {
  BaseEditTool,
  FocusDomAction,
  repeatOnMessagesUpdated,
  SelectionService,
  type IShortcutManager,
  type ShortcutRegistration
} from '@eclipse-glsp/client';
import { Action, matchesKeystroke, SelectAction, toArray, TYPES } from '@eclipse-glsp/sprotty';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { StartEventNode } from '../../diagram/model';

@injectable()
export class IvyGlobalKeyListenerTool extends BaseEditTool {
  @inject(SelectionService) protected selectionService: SelectionService;

  static ID = 'ivy.global-key-listener';
  static TOKEN = Symbol.for(IvyGlobalKeyListenerTool.name);

  protected alreadyRegistered = false;

  @inject(TYPES.IShortcutManager)
  protected readonly shortcutManager: IShortcutManager;

  get id(): string {
    return IvyGlobalKeyListenerTool.ID;
  }

  enable(): void {
    if (!this.alreadyRegistered) {
      this.alreadyRegistered = true;
      document.addEventListener('keyup', this.trigger.bind(this));
      repeatOnMessagesUpdated(() => this.shortcutManager.register(this.shortcutRegistrationsToken(), this.shortcutRegistrations()));
    }
  }

  protected shortcutRegistrationsToken(): symbol {
    return IvyGlobalKeyListenerTool.TOKEN;
  }

  protected shortcutRegistrations(): ShortcutRegistration[] {
    return [
      {
        shortcuts: ['1'],
        description: t('a11y.hotkeyDesc.focusToolbar'),
        group: t('a11y.hotkeyGroup.toolbar'),
        position: 0
      },
      {
        shortcuts: ['2'],
        description: t('a11y.hotkeyDesc.focusGraph'),
        group: t('a11y.hotkeyGroup.graph'),
        position: 0
      }
    ];
  }

  trigger(event: KeyboardEvent): void {
    this.actionDispatcher.dispatchAll(this.handleKeyEvent(event));
  }

  protected handleKeyEvent(event: KeyboardEvent): Action[] {
    if (this.isInput(event)) {
      return [];
    }
    if (this.matchesSetFocusOnToolPalette(event)) {
      return [FocusDomAction.create(`#btn_default_tools`)];
    }
    if (this.matchesSetFocusOnDiagram(event)) {
      const actions: Action[] = [FocusDomAction.create(`#${document.querySelector('svg.sprotty-graph')?.parentElement?.id}`)];
      if (!this.selectionService.hasSelectedElements()) {
        const startEvent = toArray(this.selectionService.getModelRoot().index.all()).find(e => e instanceof StartEventNode);
        if (startEvent) {
          actions.push(SelectAction.create({ selectedElementsIDs: [startEvent.id] }));
        }
      }
      return actions;
    }
    return [];
  }

  protected isInput(event: KeyboardEvent) {
    return event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
  }

  protected matchesSetFocusOnToolPalette(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Digit1') || matchesKeystroke(event, 'Numpad1');
  }

  protected matchesSetFocusOnDiagram(event: KeyboardEvent): boolean {
    return matchesKeystroke(event, 'Digit2') || matchesKeystroke(event, 'Numpad2');
  }
}
