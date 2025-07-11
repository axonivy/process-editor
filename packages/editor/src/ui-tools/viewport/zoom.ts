import { Action, GModelElement, isCtrlOrCmd, ZoomMouseListener } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class IvyZoomMouseListener extends ZoomMouseListener {
  wheel(target: GModelElement, event: WheelEvent): Action[] {
    if (!isCtrlOrCmd(event)) {
      return [];
    }
    return super.wheel(target, event);
  }

  protected getZoomFactor(event: WheelEvent): number {
    if (event.deltaMode === event.DOM_DELTA_PAGE) {
      return Math.exp(-event.deltaY * 0.5);
    } else if (event.deltaMode === event.DOM_DELTA_LINE) {
      return Math.exp(-event.deltaY * 0.05);
    } else {
      // deltaMode === DOM_DELTA_PIXEL
      return Math.exp(-event.deltaY * 0.003);
    }
  }
}
