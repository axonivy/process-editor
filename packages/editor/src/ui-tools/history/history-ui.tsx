import { EnableHistoryAction, ShowHistoryAction } from '@axonivy/process-editor-protocol';
import {
  GArgument,
  getAbsoluteBounds,
  GModelRoot,
  isBoundsAware,
  ISelectionListener,
  SelectionService,
  SetViewportAction,
  TYPES,
  type Action,
  type BoundsAware,
  type GModelElement,
  type IActionDispatcher,
  type IActionHandler
} from '@eclipse-glsp/client';
import { inject, injectable, postConstruct } from 'inversify';
import * as React from 'react';
import { isExecutable, type Executable } from '../../execution/model';
import { ReactUIExtension } from '../../utils/react-ui-extension';
import { HistoryPopover } from './History';

@injectable()
export class HistoryUi extends ReactUIExtension implements IActionHandler, ISelectionListener {
  static readonly ID = 'history-ui';

  @inject(SelectionService) protected readonly selectionService!: SelectionService;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  private showHistory = false;
  private element?: GModelElement & BoundsAware & Executable;

  public id(): string {
    return HistoryUi.ID;
  }

  @postConstruct()
  protected init(): void {
    this.selectionService.onSelectionChanged(event => this.selectionChanged(event.root, event.selectedElements));
  }

  public containerClass(): string {
    return 'history-ui-container';
  }

  protected override initializeContents(containerElement: HTMLElement) {
    super.initializeContents(containerElement);
    this.setContainerVisible(false);
  }

  protected render(): React.ReactNode {
    if (!this.showHistory) {
      return null;
    }
    if (!this.element) {
      return null;
    }
    const app = GArgument.getString(this.editorContext.modelRoot, 'app') ?? '';
    const pmv = GArgument.getString(this.editorContext.modelRoot, 'pmv') ?? '';
    const bounds = getAbsoluteBounds(this.element);
    return (
      <HistoryPopover
        bounds={bounds}
        containerElement={this.containerElement}
        actionDispatcher={this.actionDispatcher}
        app={app}
        pmv={pmv}
        pid={this.element.id}
        closeHistory={() => this.closeHistory()}
      />
    );
  }

  handle(action: Action) {
    if (EnableHistoryAction.is(action)) {
      this.initialize();
    }
    if (ShowHistoryAction.is(action)) {
      this.showHistory = true;
      this.updateHistory(this.editorContext.modelRoot, action.elementId);
    }
    if (SetViewportAction.is(action)) {
      this.updateHistory(this.editorContext.modelRoot, this.selectionService.getSelectedElementIDs().at(0));
    }
  }

  selectionChanged(root: Readonly<GModelRoot>, selectedElements: string[]) {
    this.updateHistory(root, selectedElements.at(0));
  }

  updateHistory(root: Readonly<GModelRoot>, elementId?: string) {
    const element = historyElement(root, elementId);
    if (element) {
      this.element = element;
      this.setContainerVisible(true);
    } else {
      this.closeHistory();
    }
  }

  closeHistory() {
    this.element = undefined;
    this.showHistory = false;
    this.setContainerVisible(false);
  }
}

type HistoryElement = GModelElement & BoundsAware & Executable & { executionCount: number };

const historyElement = (root: Readonly<GModelRoot>, elementId?: string) => {
  if (!elementId) {
    return;
  }
  const element = root.index.getById(elementId);
  if (!element) {
    return;
  }
  if (isHistoryElement(element)) {
    return element;
  }
};

const isHistoryElement = (element: GModelElement | undefined): element is HistoryElement => {
  return !!element && isExecutable(element) && element.executionCount !== undefined && isBoundsAware(element);
};
