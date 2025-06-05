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
import type { IvySvgExporter } from '../tools/export/ivy-svg-exporter';

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
  @inject(TYPES.SvgExporter) protected svgExporter: IvySvgExporter;

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
    this.clipboardService.put(action.clipboardData, clipboardId);
    if (navigator.clipboard) {
      const clipboardItemData: Record<string, string | Blob | PromiseLike<string | Blob>> = {
        'text/plain': action.clipboardData[PROCESS_DATA_FORMAT]
      };
      const svg = this.svgExporter.plainExport(this.editorContext.modelRoot);
      if (svg) {
        clipboardItemData['image/png'] = toPNGBlob(svg, this.editorContext.modelRoot.canvasBounds);
      }
      const clipboardItem = new ClipboardItem(clipboardItemData);
      // navigator.clipboard.writeText(action.clipboardData[PROCESS_DATA_FORMAT]);
      navigator.clipboard.write([clipboardItem]);
    } else {
      console.log('Could not access native clipboard, use local memory instead');
    }
  }

  getClipboardData(data: DataTransfer) {
    const clipboardId = getClipboardIdFromDataTransfer(data);
    if (clipboardId) {
      return this.clipboardService.get(clipboardId);
    }
    for (const item of data.items) {
      console.log(item.type);
      console.log(item.getAsFile()?.size);
      item.getAsString(console.log);
    }
    console.log(data.items);
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

const toPNGBlob = async (svg: string, size: { width: number; height: number }) => {
  return new Promise<Blob>((resolve, reject) => {
    const canvas = new OffscreenCanvas(size.width, size.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to get 2D rendering context.'));
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size.width, size.height);
      canvas.convertToBlob({ type: 'image/png' }).then(resolve).catch(reject);
    };
    img.onerror = error => {
      reject(new Error(`Failed to load SVG as image: ${error}`));
    };
    const encodedSvg = encodeURIComponent(svg);
    img.src = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
  });
};
