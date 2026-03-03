import { isExecutable, ReactUIExtension, type Executable } from '@axonivy/process-editor';
import { EnableHistoryAction, ShowHistoryAction } from '@axonivy/process-editor-protocol';
import { Popover, PopoverAnchor, PopoverContent } from '@axonivy/ui-components';
import {
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
import { History } from './History';

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
    this.changeUiVisiblitiy(false);
  }

  protected render(): React.ReactNode {
    if (!this.element) {
      return null;
    }
    const bounds = getAbsoluteBounds(this.element);
    return (
      <Popover open={this.showHistory}>
        <PopoverAnchor asChild>
          <div
            style={{
              position: 'absolute',
              top: `${bounds.y - 6}px`,
              left: `${bounds.x - 6}px`,
              height: `${bounds.height + 12}px`,
              width: `${bounds.width + 12}px`,
              visibility: 'hidden'
            }}
          />
        </PopoverAnchor>
        <PopoverContent
          side='bottom'
          align='center'
          sideOffset={10}
          collisionPadding={8}
          container={this.containerElement}
          collisionBoundary={this.containerElement}
          style={{ width: 500, visibility: 'visible' }}
        >
          <History elementId={this.element.id} />
        </PopoverContent>
      </Popover>
    );
  }

  private changeUiVisiblitiy(force?: boolean) {
    if (force !== undefined) {
      this.setContainerVisible(force);
    } else {
      this.toggleContainerVisible();
    }
    window.dispatchEvent(new CustomEvent('resize'));
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
      this.changeUiVisiblitiy(true);
    } else {
      this.element = undefined;
      this.showHistory = false;
      this.changeUiVisiblitiy(false);
    }
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
