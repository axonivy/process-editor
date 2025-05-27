import { isOpenable, SModelElement } from '@eclipse-glsp/client';
import { type QuickAction, QuickActionLocation, SingleQuickActionProvider, StreamlineIcons } from '@axonivy/process-editor';
import { injectable } from 'inversify';
import { OpenAction } from 'sprotty-protocol';
import type { KeyCode } from 'sprotty/lib/utils/keyboard';

@injectable()
export class InscribeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isOpenable(element)) {
      return new InscribeQuickAction(element.id);
    }
    return undefined;
  }
}

class InscribeQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.Edit,
    public readonly title = 'Edit (E)',
    public readonly location = QuickActionLocation.Left,
    public readonly sorting = 'B',
    public readonly action = OpenAction.create(elementId),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyE'
  ) {}
}
