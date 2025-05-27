import { SModelElement } from '@eclipse-glsp/client';
import {
  type QuickAction,
  QuickActionLocation,
  SingleQuickActionProvider,
  isWithCustomIcon,
  ActivityTypes,
  StreamlineIcons
} from '@axonivy/process-editor';
import { injectable } from 'inversify';
import { OpenDecoratorBrowserAction } from './action';

@injectable()
export class CustomIconQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (isWithCustomIcon(element) && element.type !== ActivityTypes.COMMENT) {
      return new CustomIconQuickAction(element.id);
    }
    return undefined;
  }
}

class CustomIconQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.CustomIcon,
    public readonly title = 'Custom Icon',
    public readonly location = QuickActionLocation.Middle,
    public readonly sorting = 'C',
    public readonly action = OpenDecoratorBrowserAction.create(elementId)
  ) {}
}
