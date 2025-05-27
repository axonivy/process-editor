import { Action, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import type { KeyCode } from 'sprotty/lib/utils/keyboard';
import {
  EventStartTypes,
  type QuickAction,
  QuickActionLocation,
  SingleQuickActionProvider,
  StartEventNode,
  StreamlineIcons
} from '@axonivy/process-editor';

@injectable()
export class StarProcessQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof StartEventNode && element.type === EventStartTypes.START) {
      return new StartProcessQuickAction(element.id);
    }
    return undefined;
  }
}

class StartProcessQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.Play,
    public readonly title = 'Start Process (X)',
    public readonly location = QuickActionLocation.Left,
    public readonly sorting = 'A',
    public readonly action = StartProcessAction.create(elementId),
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyX',
    public readonly removeSelection = true
  ) {}
}

export interface StartProcessAction extends Action {
  kind: typeof StartProcessAction.KIND;
  elementId: string;
}

export namespace StartProcessAction {
  export const KIND = 'startProcess';

  export function create(elementId: string): StartProcessAction {
    return {
      kind: KIND,
      elementId
    };
  }
}

@injectable()
export class SearchProcessCallersActionProvider extends SingleQuickActionProvider {
  private supportedEventTypes = [
    EventStartTypes.START,
    EventStartTypes.START_ERROR,
    EventStartTypes.START_SUB,
    EventStartTypes.START_HD,
    EventStartTypes.START_HD_METHOD
  ];
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof StartEventNode && this.isSearchViewAvailable(element.type)) {
      return new SearchProcessCallersQuickAction(element.id);
    }
    return undefined;
  }

  private isSearchViewAvailable(type: string): boolean {
    return this.supportedEventTypes.includes(type);
  }
}

class SearchProcessCallersQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = StreamlineIcons.Search,
    public readonly title = 'Search callers of this process (O)',
    public readonly location = QuickActionLocation.Left,
    public readonly sorting = 'B',
    public readonly action = SearchProcessCallersAction.create(elementId),
    public readonly letQuickActionsOpen = true,
    public readonly readonlySupport = true,
    public readonly shortcut: KeyCode = 'KeyO'
  ) {}
}

export interface SearchProcessCallersAction extends Action {
  kind: typeof SearchProcessCallersAction.KIND;
  elementId: string;
}

export namespace SearchProcessCallersAction {
  export const KIND = 'searchProcessCallers';

  export function create(elementId: string): SearchProcessCallersAction {
    return {
      kind: KIND,
      elementId
    };
  }
}
