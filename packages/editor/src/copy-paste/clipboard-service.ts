import { PasteOperation, TYPES, type ClipboardData, type IActionDispatcher, type IAsyncClipboardService } from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

@injectable()
export class ClipboardService implements IAsyncClipboardService {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  protected currentId?: string;
  protected data?: ClipboardData;

  clear(): void {
    this.currentId = undefined;
    this.data = undefined;
  }

  put(data: ClipboardData, id: string): void {
    this.currentId = id;
    this.data = data;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data['application/json']);
    }
  }

  get(id?: string): ClipboardData | undefined {
    if (id === this.currentId) {
      return this.data;
    }
    if (navigator.clipboard) {
      this.actionDispatcher.dispatch(
        PasteOperation.create({ clipboardData: { 'application/json': data }, editorContext: this.editorContext.get() })
      );
    }
    return undefined;
  }
}
