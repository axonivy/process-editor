import { MoveIntoViewportAction, OriginViewportAction, SetViewportZoomAction } from '@axonivy/process-editor-protocol';
import {
  Bounds,
  type BoundsAwareModelElement,
  BoundsAwareViewportCommand,
  CenterCommand,
  Command,
  type CommandExecutionContext,
  type CommandReturn,
  Dimension,
  FitToScreenAction,
  FitToScreenCommand,
  GModelElement,
  GModelRoot,
  Point,
  SelectionService,
  TYPES,
  type Viewport,
  type Writable,
  forEachElement,
  getElements,
  isBoundsAware,
  isSelected,
  isViewport,
  limitViewport
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import { MulitlineEditLabel } from '../../diagram/model';
import { ToolBar } from '../tool-bar/tool-bar';

@injectable()
export class OriginViewportCommand extends BoundsAwareViewportCommand {
  static readonly KIND = OriginViewportAction.KIND;

  constructor(@inject(TYPES.Action) protected action: OriginViewportAction) {
    super(action.animate);
  }

  getElementIds(): string[] {
    return [];
  }

  protected override initialize(model: GModelRoot): void {
    if (!isViewport(model)) {
      return;
    }
    this.oldViewport = { scroll: model.scroll, zoom: model.zoom };
    const newViewport = this.getNewViewport();
    if (newViewport) {
      const { zoomLimits, horizontalScrollLimits, verticalScrollLimits } = this.viewerOptions;
      this.newViewport = limitViewport(newViewport, model.canvasBounds, horizontalScrollLimits, verticalScrollLimits, zoomLimits);
    }
  }

  getNewViewport() {
    return { zoom: 1, scroll: { x: 0, y: 0 } };
  }
}

function isBoundsRelevantElement(element?: GModelElement): element is BoundsAwareModelElement {
  return !!element && isBoundsAware(element) && !(element instanceof MulitlineEditLabel);
}

function isSelectedBoundsRelevantElement(element?: GModelElement): element is BoundsAwareModelElement {
  return isSelected(element) && isBoundsAware(element) && !(element instanceof MulitlineEditLabel);
}

@injectable()
export class IvyFitToScreenCommand extends FitToScreenCommand {
  static override readonly KIND = FitToScreenAction.KIND;

  constructor(@inject(TYPES.Action) protected override readonly action: FitToScreenAction) {
    super(action);
  }

  override getNewViewport(bounds: Bounds, model: GModelRoot): Viewport | undefined {
    if (!Dimension.isValid(model.canvasBounds)) {
      return undefined;
    }
    const c = Bounds.center(bounds);
    const delta = this.action.padding === undefined ? 0 : 2 * this.action.padding;
    const toolBarHeight = this.toolBarHeight();
    let zoom = Math.min(
      model.canvasBounds.width / (bounds.width + delta),
      (model.canvasBounds.height - toolBarHeight) / (bounds.height + delta)
    );
    if (this.action.maxZoom !== undefined) {
      zoom = Math.min(zoom, this.action.maxZoom);
    }
    if (zoom === Infinity) {
      zoom = 1;
    }
    return {
      scroll: {
        x: c.x - (0.5 * model.canvasBounds.width) / zoom,
        y: c.y - (0.5 * (model.canvasBounds.height + toolBarHeight)) / zoom
      },
      zoom: zoom
    };
  }

  private toolBarHeight(): number {
    const toolBar = document.querySelector('[id$="_' + ToolBar.ID + '"]');
    return toolBar ? toolBar.getBoundingClientRect().height : 0;
  }

  protected override initialize(model: GModelRoot): void {
    if (isViewport(model)) {
      this.oldViewport = {
        scroll: model.scroll,
        zoom: model.zoom
      };
      const allBounds: Bounds[] = [];

      // first priority: elements given by the action
      getElements(model.index, this.getElementIds(), isBoundsRelevantElement).forEach(element =>
        allBounds.push(this.boundsInViewport(element, element.bounds, model))
      );

      // second priority: selected elements from the index
      if (allBounds.length === 0) {
        forEachElement(model.index, isSelectedBoundsRelevantElement, element =>
          allBounds.push(this.boundsInViewport(element, element.bounds, model))
        );
      }

      // third priority: all respective elements
      if (allBounds.length === 0) {
        forEachElement(model.index, isBoundsRelevantElement, element =>
          allBounds.push(this.boundsInViewport(element, element.bounds, model))
        );
      }

      // calculate encompassing bounds
      const bounds = allBounds.reduce((b0, b1) => Bounds.combine(b0, b1), Bounds.EMPTY);
      if (Dimension.isValid(bounds)) {
        const newViewport = this.getNewViewport(bounds, model);
        if (newViewport) {
          const { zoomLimits, horizontalScrollLimits, verticalScrollLimits } = this.viewerOptions;
          this.newViewport = limitViewport(newViewport, model.canvasBounds, horizontalScrollLimits, verticalScrollLimits, zoomLimits);
        }
      }
    }
  }
}

@injectable()
export class IvyCenterCommand extends CenterCommand {
  @inject(SelectionService) protected selectionService!: SelectionService;

  override getNewViewport(bounds: Writable<Bounds>, model: GModelRoot): Viewport | undefined {
    if (!Dimension.isValid(model.canvasBounds)) {
      return undefined;
    }
    return super.getNewViewport(bounds, model);
  }

  protected override initialize(model: GModelRoot): void {
    if (!isViewport(model)) {
      return;
    }
    this.oldViewport = {
      scroll: model.scroll,
      zoom: model.zoom
    };
    const allBounds: Bounds[] = [];

    // first priority: elements given by the action
    getElements(model.index, this.getElementIds(), isBoundsRelevantElement).forEach(element =>
      allBounds.push(this.boundsInViewport(element, element.bounds, model))
    );

    // second priority: selected elements from the index
    if (allBounds.length === 0) {
      forEachElement(model.index, isSelectedBoundsRelevantElement, element =>
        allBounds.push(this.boundsInViewport(element, element.bounds, model))
      );
    }

    // third priority: all respective elements
    if (allBounds.length === 0) {
      forEachElement(model.index, isBoundsRelevantElement, element =>
        allBounds.push(this.boundsInViewport(element, element.bounds, model))
      );
    }

    // calculate encompassing bounds
    const bounds = allBounds.reduce((b0, b1) => Bounds.combine(b0, b1), Bounds.EMPTY);
    if (Dimension.isValid(bounds)) {
      const newViewport = this.getNewViewport(bounds, model);
      if (newViewport) {
        const { zoomLimits, horizontalScrollLimits, verticalScrollLimits } = this.viewerOptions;
        this.newViewport = limitViewport(newViewport, model.canvasBounds, horizontalScrollLimits, verticalScrollLimits, zoomLimits);
      }
    }
  }
}

@injectable()
export class MoveIntoViewportCommand extends BoundsAwareViewportCommand {
  static readonly KIND = MoveIntoViewportAction.KIND;

  constructor(@inject(TYPES.Action) protected action: MoveIntoViewportAction) {
    super(action.animate);
  }

  getElementIds(): string[] {
    return this.action.elementIds;
  }

  getNewViewport(bounds: Bounds, model: GModelRoot): Viewport | undefined {
    if (!Dimension.isValid(model.canvasBounds)) {
      return undefined;
    }
    return moveIntoViewport(
      model.canvasBounds,
      isViewport(model) ? model.scroll : Point.ORIGIN,
      Bounds.center(bounds),
      this.action.retainZoom && isViewport(model) ? model.zoom : 1
    );
  }
}

export function moveIntoViewport(viewPort: Bounds, currentScrollPos: Point, elementPos: Point, zoom: number): Viewport {
  return {
    scroll: {
      x: calculateScroll(viewPort.width, currentScrollPos.x, elementPos.x, zoom),
      y: calculateScroll(viewPort.height, currentScrollPos.y, elementPos.y, zoom)
    },
    zoom: zoom
  };
}

function calculateScroll(viewPort: number, currentScrollPos: number, elementPos: number, zoom: number): number {
  const effectivePos = elementPos - currentScrollPos;
  return effectivePos > viewPort || effectivePos < 0 ? elementPos - (0.5 * viewPort) / zoom : currentScrollPos;
}

@injectable()
export class IvySetViewportZoomCommand extends Command {
  static readonly KIND = SetViewportZoomAction.KIND;

  constructor(@inject(TYPES.Action) protected readonly action: SetViewportZoomAction) {
    super();
  }

  execute(context: CommandExecutionContext): CommandReturn {
    const model = context.root;
    if (isViewport(model)) {
      model.zoom = this.action.zoom;
    }
    return model;
  }

  undo(context: CommandExecutionContext): CommandReturn {
    context.logger.error(this, 'Cannot undo a ivy viewport zoom command');
    return context.root;
  }
  redo(context: CommandExecutionContext): CommandReturn {
    context.logger.error(this, 'Cannot redo a ivy viewport zoom command');
    return context.root;
  }
}
