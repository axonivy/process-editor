import { IvyIcons } from '@axonivy/ui-icons';
import {
  GArgument,
  GChildElement,
  GEdge,
  GIssueMarker,
  GModelElement,
  TYPES,
  hasArgs,
  isWithEditableLabel,
  type IActionDispatcher,
  type JsonAny
} from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { LaneNode } from '../../../diagram/model';
import type { IvyViewerOptions } from '../../../options';
import { IVY_TYPES } from '../../../types';
import { SingleQuickActionProvider, type QuickAction } from '../quick-action';
import { ShowInfoQuickActionMenuAction } from '../quick-action-menu-ui';

@injectable()
export class InfoQuickActionProvider extends SingleQuickActionProvider {
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(IVY_TYPES.IvyViewerOptions) protected readonly options: IvyViewerOptions;

  singleQuickAction(element: GModelElement): QuickAction | undefined {
    if (element instanceof LaneNode || (this.options.hideSensitiveInfo && element instanceof GEdge)) {
      return undefined;
    }
    return {
      icon: IvyIcons.InfoCircle,
      title: t('quickAction.information', { hotkey: 'I' }),
      location: 'Left',
      sorting: 'B',
      action: ShowInfoQuickActionMenuAction.create({
        elementId: element.id,
        markers: this.markers(element),
        title: this.name(element),
        text: hasArgs(element) && element.args ? GArgument.getString(element, 'desc') : '',
        info: this.info(element)
      }),
      letQuickActionsOpen: true,
      readonlySupport: true,
      shortcut: 'KeyI'
    };
  }

  private info(element: GModelElement): JsonAny | undefined {
    return hasArgs(element) && element.args ? element.args['info'] : undefined;
  }

  private name(element: GModelElement): string | undefined {
    let elementName = '';
    if (isWithEditableLabel(element) && element.editableLabel) {
      elementName = element.editableLabel?.text;
    }
    const varName = this.nameAddition(element);
    if (varName) {
      elementName += varName;
    }
    return elementName.length > 0 ? elementName.trim() : undefined;
  }

  private nameAddition(element: GModelElement): string | undefined {
    if (hasArgs(element) && element.args) {
      const varName = GArgument.getString(element, 'varName');
      if (varName) {
        return ` [${varName}]`;
      }
      const outerElement = GArgument.getString(element, 'outerElement');
      if (outerElement) {
        return ` [${outerElement}]`;
      }
    }
    return undefined;
  }

  private markers(element: GModelElement): GIssueMarker[] {
    if (element instanceof GChildElement) {
      return element.children.filter(child => child instanceof GIssueMarker).map(child => child as GIssueMarker);
    }
    return [];
  }
}
