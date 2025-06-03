import {
  EditorContextService,
  TYPES,
  type Action,
  type IActionDispatcher,
  type IActionHandler,
  type ViewerOptions
} from '@eclipse-glsp/client';
import { inject } from 'inversify';

export abstract class InvokeActionHandler implements IActionHandler {
  @inject(TYPES.IActionDispatcher) protected actionDispatcher: IActionDispatcher;
  @inject(EditorContextService) protected editorContext: EditorContextService;
  @inject(TYPES.ViewerOptions) protected viewerOptions: ViewerOptions;

  abstract handle(action: Action): void;

  protected isDiagramActive(): boolean {
    return document.activeElement?.parentElement?.id === this.viewerOptions.baseDiv;
  }
}
