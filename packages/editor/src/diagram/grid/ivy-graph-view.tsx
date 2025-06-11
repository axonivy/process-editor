import {
  Bounds,
  getModelBounds,
  GLSPProjectionView,
  GridManager,
  GViewportRootElement,
  isViewport,
  type IViewArgs,
  type RenderingContext,
  setAttr,
  SGraphImpl,
  type Writable
} from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { type VNode, h } from 'snabbdom';

@injectable()
export class IvyGraphView extends GLSPProjectionView {
  override render(model: Readonly<GViewportRootElement>, context: RenderingContext, args?: IViewArgs): VNode {
    const rootNode = h('div', { 'aria-label': 'Diagram', style: { width: '100%', height: '100%' } }, [
      this.renderSvg(model, context),
      ...this.renderProjections(model, context, args)
    ]);
    if (context.targetKind === 'main') {
      setAttr(rootNode, 'tabindex', 1);
    }
    setAttr(rootNode, 'aria-label', 'Diagram');
    return rootNode;
  }

  protected override getBackgroundBounds(
    viewport: Readonly<SGraphImpl>,
    context: RenderingContext,
    gridManager: GridManager
  ): Writable<Bounds> {
    // we define our grid as 8x8 for all intents and purposes of moving, resizing, etc.
    // however visually we render it 16x16 giving the illusion of half-grid movement
    // alternatively this could be achieved by adapting the grid snapper
    const bounds = super.getBackgroundBounds(viewport, context, gridManager);
    bounds.height = bounds.height * 2;
    bounds.width = bounds.width * 2;
    return bounds;
  }

  protected override renderSvg(model: Readonly<GViewportRootElement>, context: RenderingContext): VNode {
    const edgeRouting = this.edgeRouterRegistry.routeAllChildren(model);
    const transform = `scale(${model.zoom}) translate(${-model.scroll.x},${-model.scroll.y})`;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = h(
      'svg',
      { ns, style: { height: '100%', ...this.getGridStyle(model, context) }, class: { 'sprotty-graph': true } },
      h('g', { ns, attrs: { transform } }, [...context.renderChildren(model, { edgeRouting }), this.renderNegativeArea(model)])
    );
    return svg;
  }

  protected renderNegativeArea(model: Readonly<GViewportRootElement>): VNode {
    if (isViewport(model.root)) {
      const modelBounds = getModelBounds(model.root) ?? Bounds.EMPTY;
      return h('g', { class: { 'negative-area-group': true } }, [
        h('rect', {
          attrs: {
            x: modelBounds.x,
            y: modelBounds.y,
            width: modelBounds.width,
            height: -modelBounds.y
          },
          class: { 'negative-area': true }
        }),
        h('rect', {
          attrs: { x: modelBounds.x, y: 0, width: -modelBounds.x, height: modelBounds.height },
          class: { 'negative-area': true }
        })
      ]);
    }
    return h('g', {}, []);
  }
}
