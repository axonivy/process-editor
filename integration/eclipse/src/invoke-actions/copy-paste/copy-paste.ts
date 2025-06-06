import type { Action } from '@eclipse-glsp/client';
import { CutOperation, PasteOperation, RequestClipboardDataAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { InvokeActionHandler } from '../InvokeActionHandler';

// Eclipse-specific integration: in Eclipse, we trigger the Copy/Paste actions from
// the IDE Keybindings. We don't use the browser events. This is fine, because we
// don't need browser clipboard support (We use the Eclipse System Clipboard); so
// we don't need special permission from the Browser.

@injectable()
export class IvyEclipseCopyPasteActionHandler extends InvokeActionHandler {
  handle(action: Action): void {
    switch (action.kind) {
      case 'invoke-copy':
        this.handleCopy();
        break;
      case 'invoke-paste':
        this.handlePaste();
        break;
      case 'invoke-cut':
        this.handleCut();
        break;
    }
  }

  handleCopy() {
    if (this.shouldCopy()) {
      this.actionDispatcher.request(RequestClipboardDataAction.create(this.editorContext.get()));
    }
  }

  handleCut() {
    if (this.shouldCopy()) {
      this.handleCopy();
      this.actionDispatcher.dispatch(CutOperation.create(this.editorContext.get()));
    }
  }

  handlePaste() {
    if (this.isDiagramActive()) {
      this.actionDispatcher.dispatch(PasteOperation.create({ clipboardData: {}, editorContext: this.editorContext.get() }));
    }
  }

  protected shouldCopy(): boolean {
    return this.editorContext.get().selectedElementIds.length > 0 && this.isDiagramActive();
  }
}
