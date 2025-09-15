import { BringToFrontAction, BringToFrontCommand, GChildElement, TYPES } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

import { LaneNode } from '../diagram/model';

@injectable()
export class IvyBringToFrontCommand extends BringToFrontCommand {
  constructor(@inject(TYPES.Action) public override action: BringToFrontAction) {
    super(action);
  }

  protected override addToSelection(element: GChildElement): void {
    if (element instanceof LaneNode) {
      return;
    }
    this.selected.push({
      element: element,
      index: element.parent.children.indexOf(element)
    });
  }
}
