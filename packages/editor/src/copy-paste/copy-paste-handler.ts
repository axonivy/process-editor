import type {
  IActionDispatcher,
  IAsyncClipboardService,
  ViewerOptions,
  ICopyPasteHandler,
  SetClipboardDataAction
} from '@eclipse-glsp/client';
import { TYPES, EditorContextService, RequestClipboardDataAction, CutOperation, PasteOperation } from '@eclipse-glsp/client';
import { injectable, inject } from 'inversify';
import { v4 as uuid } from 'uuid';

interface ClipboardId {
  readonly clipboardId: string;
}

function toClipboardId(clipboardId: string): string {
  return JSON.stringify({ clipboardId });
}

function isClipboardId(jsonData: unknown): jsonData is ClipboardId {
  return jsonData !== null && typeof jsonData === 'object' && 'clipboardId' in jsonData;
}

function getClipboardIdFromDataTransfer(dataTransfer: DataTransfer): string | undefined {
  const jsonString = dataTransfer.getData(CLIPBOARD_DATA_FORMAT);
  const jsonObject = jsonString ? JSON.parse(jsonString) : undefined;
  return isClipboardId(jsonObject) ? jsonObject.clipboardId : undefined;
}

const CLIPBOARD_DATA_FORMAT = 'ivyprocess/clipboardid';
const PROCESS_DATA_FORMAT = 'text/plain';

@injectable()
export class IvyServerCopyPasteHandler implements ICopyPasteHandler {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  @inject(TYPES.ViewerOptions) protected viewerOptions: ViewerOptions;
  @inject(TYPES.IAsyncClipboardService) protected clipboardService: IAsyncClipboardService;
  @inject(EditorContextService) protected editorContext: EditorContextService;

  handleCopy(event: ClipboardEvent): void {
    if (event.clipboardData && this.shouldCopy()) {
      const clipboardId = uuid();
      event.clipboardData.setData(CLIPBOARD_DATA_FORMAT, toClipboardId(clipboardId));
      this.actionDispatcher
        .request(RequestClipboardDataAction.create(this.editorContext.get()))
        .then(action => this.setClipboardData(action, clipboardId));
      event.preventDefault();
    } else {
      if (event.clipboardData) {
        event.clipboardData.clearData();
      }
      this.clipboardService.clear();
    }
  }

  handleCut(event: ClipboardEvent): void {
    if (event.clipboardData && this.shouldCopy()) {
      this.handleCopy(event);
      this.actionDispatcher.dispatch(CutOperation.create(this.editorContext.get()));
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent): void {
    if (event.clipboardData && this.shouldPaste()) {
      const clipboardData = this.getClipboardData(event.clipboardData);
      if (clipboardData) {
        this.actionDispatcher.dispatch(PasteOperation.create({ clipboardData, editorContext: this.editorContext.get() }));
      }
      event.preventDefault();
    }
  }

  setClipboardData(action: SetClipboardDataAction, clipboardId: string) {
    console.debug('Added data to clipboard: ', action.clipboardData[PROCESS_DATA_FORMAT]);
    this.clipboardService.put(action.clipboardData, clipboardId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(action.clipboardData[PROCESS_DATA_FORMAT]);
    } else {
      console.log('Could not access native clipboard, use local memory instead');
    }
  }

  getClipboardData(data: DataTransfer) {
    const clipboardId = getClipboardIdFromDataTransfer(data);
    if (clipboardId) {
      return this.clipboardService.get(clipboardId);
    }
    return { [PROCESS_DATA_FORMAT]: data.getData('text/plain') };
  }

  protected shouldCopy(): boolean {
    return this.editorContext.get().selectedElementIds.length > 0 && this.isDiagramActive();
  }

  protected shouldPaste(): boolean {
    return this.isDiagramActive();
  }

  private isDiagramActive(): boolean {
    return document.activeElement?.parentElement?.id === this.viewerOptions.baseDiv;
  }
}
