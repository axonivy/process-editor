import { SModelElement } from '@eclipse-glsp/client';
import {
  type QuickAction,
  QuickActionLocation,
  SingleQuickActionProvider,
  hasGoToSourceFeature,
  StreamlineIcons
} from '@axonivy/process-editor';
import { injectable } from 'inversify';
import type { KeyCode } from 'sprotty/lib/utils/keyboard';
import { GoToSourceAction } from './action';

@injectable()
export class GoToSourceQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (hasGoToSourceFeature(element)) {
      return new GoToSourceQuickAction(element.id);
    }
    return undefined;
  }
}

class GoToSourceQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.GoToSource,
    public readonly title = 'Go To Source (S)',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'B',
    public readonly action = GoToSourceAction.create(elementId),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyS'
  ) {}
}
