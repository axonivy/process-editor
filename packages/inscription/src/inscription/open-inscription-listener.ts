import type { GModelElement } from '@eclipse-glsp/client';
import { findParentByFeature, isOpenable, isSelectable, KeyListener, matchesKeystroke, MouseListener, toArray } from '@eclipse-glsp/client';
import { OpenAction } from 'sprotty-protocol';

export class OpenInscriptionMouseListener extends MouseListener {
  doubleClick(target: GModelElement) {
    const element = findParentByFeature(target, isOpenable);
    if (element) {
      return [OpenAction.create(element.id)];
    }
    return [];
  }
}

export class OpenInscriptionKeyListener extends KeyListener {
  keyDown(element: GModelElement, event: KeyboardEvent) {
    if (matchesKeystroke(event, 'Enter')) {
      const openableElements = this.getOpenableElements(element);
      if (openableElements.length === 1) {
        return [OpenAction.create(openableElements[0].id)];
      }
    }
    return [];
  }

  private getOpenableElements(element: GModelElement) {
    return toArray(
      element.index
        .all()
        .filter(e => isSelectable(e) && e.selected)
        .filter(e => isOpenable(e))
    );
  }
}
