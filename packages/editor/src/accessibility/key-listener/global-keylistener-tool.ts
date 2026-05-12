import {
  FocusDomAction,
  GlobalKeyListenerTool,
  KeyboardToolPalette,
  matchesKeystroke,
  SelectAction,
  SelectionService,
  SetAccessibleKeyShortcutAction,
  toArray,
  type Action
} from '@eclipse-glsp/client';
import { injectable, inject } from 'inversify';
import { StartEventNode } from '../../diagram/model';

@injectable()
export class IvyGlobalKeyListenerTool extends GlobalKeyListenerTool {
  @inject(SelectionService) protected selectionService: SelectionService;

  registerShortcutKey(): void {
    this.actionDispatcher.onceModelInitialized().then(() => {
      this.actionDispatcher.dispatchAll([
        SetAccessibleKeyShortcutAction.create({
          token: KeyboardToolPalette.name,
          keys: [{ shortcuts: ['1'], description: 'Focus on tool palette', group: 'Tool-Palette', position: 0 }]
        }),
        SetAccessibleKeyShortcutAction.create({
          token: 'Graph',
          keys: [{ shortcuts: ['2'], description: 'Focus on graph', group: 'Graph', position: 0 }]
        })
      ]);
    });
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
