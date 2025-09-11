import {
  CutOperation,
  EditorContextService,
  MessageAction,
  PasteOperation,
  RequestClipboardDataAction,
  RequestExportSvgAction,
  SelectionService,
  TYPES,
  type Bounds,
  type GModelElement,
  type IActionDispatcher,
  type IAsyncClipboardService,
  type ICopyPasteHandler,
  type SetClipboardDataAction,
  type ViewerOptions
} from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
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
  @inject(TYPES.IActionDispatcher) protected actionDispatcher!: IActionDispatcher;
  @inject(TYPES.ViewerOptions) protected viewerOptions!: ViewerOptions;
  @inject(TYPES.IAsyncClipboardService) protected clipboardService!: IAsyncClipboardService;
  @inject(EditorContextService) protected editorContext!: EditorContextService;
  @inject(SelectionService) protected selectionService!: SelectionService;
  @inject(TYPES.SvgExporter) protected svgExporter!: IvySvgExporter;

  handleCopy(event: ClipboardEvent): void {
    if (event.clipboardData && this.shouldCopy()) {
      const clipboardId = uuid();
      event.clipboardData.setData(CLIPBOARD_DATA_FORMAT, toClipboardId(clipboardId));
      this.actionDispatcher
        .request(RequestClipboardDataAction.create(this.editorContext.get()))
        .then(action => this.setClipboardData(action, clipboardId, this.editorContext.selectedElements));
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

  async setClipboardData(action: SetClipboardDataAction, clipboardId: string, selection: Array<GModelElement>) {
    const clipboardData = action.clipboardData[PROCESS_DATA_FORMAT];
    if (!clipboardData) {
      console.debug('No process data to copy to clipboard.');
      return;
    }
    console.debug('Added data to clipboard: ', clipboardData);
    this.clipboardService.put(action.clipboardData, clipboardId);
    if (navigator.clipboard?.write) {
      const clipboardItemData: Record<string, string | Blob | PromiseLike<string | Blob>> = {
        'text/plain': clipboardData
      };
      const response = await this.actionDispatcher.request(RequestExportSvgAction.create());
      if (response.svg) {
        const bounds = this.svgExporter.getSvgBounds(this.editorContext.modelRoot);
        const cropRegion = this.svgExporter.getSvgBounds(this.editorContext.modelRoot, selection);
        clipboardItemData['image/png'] = await toPNGBlob(response.svg, {
          ...cropRegion,
          x: cropRegion.x - bounds.x,
          y: cropRegion.y - bounds.y
        });
      }
      navigator.clipboard.write([new ClipboardItem(clipboardItemData)]);
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(clipboardData);
    } else {
      this.actionDispatcher.dispatch(MessageAction.create(t('message.noNativeClipboardAccess'), { severity: 'INFO' }));
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
    return this.isDiagramActive();
  }

  protected shouldPaste(): boolean {
    return this.isDiagramActive();
  }

  private isDiagramActive(): boolean {
    return document.activeElement?.parentElement?.id === this.viewerOptions.baseDiv;
  }
}

const toPNGBlob = async (svg: string, bounds: Bounds) => {
  return new Promise<Blob>((resolve, reject) => {
    const canvas = new OffscreenCanvas(bounds.width, bounds.height);
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to get 2D rendering context.'));
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, bounds.x, bounds.y, bounds.width, bounds.height, 0, 0, bounds.width, bounds.height);
      canvas.convertToBlob({ type: 'image/png' }).then(resolve).catch(reject);
    };
    img.onerror = error => {
      reject(new Error(`Failed to load SVG as image: ${error}`));
    };
    const encodedSvg = encodeURIComponent(svg);
    img.src = `data:image/svg+xml;charset=utf-8,${encodedSvg}`;
  });
};
