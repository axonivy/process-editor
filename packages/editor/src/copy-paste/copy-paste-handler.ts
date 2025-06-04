import type { IActionHandler, IActionDispatcher, IAsyncClipboardService, ViewerOptions, InvokeCopyPasteAction } from '@eclipse-glsp/client';
import { TYPES, EditorContextService, RequestClipboardDataAction, CutOperation, PasteOperation } from '@eclipse-glsp/client';
import { injectable, inject } from 'inversify';

@injectable()
export class InvokeCopyPasteActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected dispatcher: IActionDispatcher;
  @inject(EditorContextService) protected editorContext: EditorContextService;
  @inject(TYPES.IAsyncClipboardService) protected clipboadService: IAsyncClipboardService;
  @inject(TYPES.ViewerOptions) protected viewerOptions: ViewerOptions;

  handle(action: InvokeCopyPasteAction): void {
    switch (action.command) {
      case 'copy':
        this.handleCopy();
        break;
      case 'paste':
        this.handlePaste();
        break;
      case 'cut':
        this.handleCut();
        break;
    }
  }

  handleCopy(): void {
    if (this.shouldCopy()) {
      this.dispatcher
        .request(RequestClipboardDataAction.create(this.editorContext.get()))
        .then(response => this.clipboadService.put(response.clipboardData));
    } else {
      this.clipboadService.clear();
    }
  }

  handleCut(): void {
    if (this.shouldCopy()) {
      this.handleCopy();
      this.dispatcher.dispatch(CutOperation.create(this.editorContext.get()));
    }
  }

  handlePaste(): void {
    // In the Eclipse Integration case, the server manages its own clipboard.
    // Just pass an empty clipboard data to remain compliant with the API.
    const clipboardData = {};
    this.dispatcher.dispatch(PasteOperation.create({ clipboardData: clipboardData, editorContext: this.editorContext.get() }));
  }

  protected shouldCopy(): boolean | null {
    return (
      this.editorContext.get().selectedElementIds.length > 0 &&
      (document.activeElement instanceof SVGElement || document.activeElement instanceof HTMLElement) &&
      document.activeElement.parentElement &&
      document.activeElement.parentElement.id === this.viewerOptions.baseDiv
    );
  }
}
