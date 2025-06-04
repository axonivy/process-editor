import {
  TYPES,
  GModelRoot,
  type IActionDispatcher,
  type IVNodePostprocessor,
  on,
  EditorContextService,
  RequestClipboardDataAction,
  PasteOperation,
  SvgExporter,
  type IAsyncClipboardService
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';
import type { VNode } from 'snabbdom';

@injectable()
export class CopyPasteTool implements IVNodePostprocessor {
  @inject(TYPES.IActionDispatcher) protected dispatcher: IActionDispatcher;
  @inject(EditorContextService) protected editorContext: EditorContextService;
  @inject(TYPES.IAsyncClipboardService) protected clipboardService: IAsyncClipboardService;

  async copy(element: GModelRoot, event: Event): Promise<void> {
    if (event instanceof ClipboardEvent) {
      event.preventDefault();
      event.stopPropagation();
      // const elements = this.editorContext.selectedElements.map(e => e.id).join(',');
      // console.log(elements);
      // event.clipboardData?.setData('text/plain', elements);
      // event.clipboardData?.setData('application/json', elements);
      this.dispatcher.request(RequestClipboardDataAction.create(this.editorContext.get())).then(response => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(response.clipboardData['application/json']);
        } else {
          this.clipboardService.put(response.clipboardData);
        }
      });
    }
    // console.log(event);
    // console.log(element);
  }

  async paste(element: GModelRoot, event: Event): Promise<void> {
    if (event instanceof ClipboardEvent) {
      event.preventDefault();
      event.stopPropagation();
      const data = event.clipboardData?.getData('text/plain');
      if (!data) {
        return;
      }
      // console.log(event.clipboardData?.getData('application/json'));
      // console.log(event.clipboardData?.getData('text/plain'));
      const clipboardData = { 'application/json': data };
      this.dispatcher.dispatch(PasteOperation.create({ clipboardData: clipboardData, editorContext: this.editorContext.get() }));
    }
  }

  decorate(vnode: VNode, element: GModelRoot): VNode {
    if (element instanceof GModelRoot) {
      on(vnode, 'copy', this.copy.bind(this, element));
      on(vnode, 'paste', this.paste.bind(this, element));
    }
    return vnode;
  }

  postUpdate() {}
}
