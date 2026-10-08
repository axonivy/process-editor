import {
  EditorContextService,
  GLSPAbstractUIExtension,
  SetModelAction,
  SetUIExtensionVisibilityAction,
  TYPES,
  UpdateModelAction,
  type Action,
  type GModelRoot,
  type IActionDispatcher
} from '@eclipse-glsp/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { inject, injectable, postConstruct } from 'inversify';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';

const QUERY_CLIENT = Symbol.for('QueryClient');

@injectable()
export class QueryDevTools extends GLSPAbstractUIExtension {
  static readonly ID = 'ivy-query-devtools';
  @inject(EditorContextService) protected editorContext!: EditorContextService;
  @inject(QUERY_CLIENT) protected queryClient!: QueryClient;
  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher!: IActionDispatcher;

  protected nodeRoot?: Root;
  protected currentRoot?: Readonly<GModelRoot>;

  id(): string {
    return QueryDevTools.ID;
  }

  containerClass() {
    return QueryDevTools.ID;
  }

  @postConstruct()
  protected init() {}

  protected initializeContents(containerElement: HTMLElement): void {
    this.nodeRoot = createRoot(containerElement);
  }

  protected override onBeforeShow(containerElement: HTMLElement, root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
    this.currentRoot = root;
    super.onBeforeShow(containerElement, root, ...contextElementIds);
    this.update();
  }

  protected override setContainerVisible(visible: boolean): void {
    super.setContainerVisible(visible);
    this.update();
  }

  protected update(): void {
    const root = this.root();
    if (!root || !this.nodeRoot) {
      return;
    }
    this.nodeRoot.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(
          QueryClientProvider,
          { client: this.queryClient },
          React.createElement(ReactQueryDevtools, { buttonPosition: 'bottom-left' })
        )
      )
    );
  }

  protected root() {
    try {
      return this.currentRoot ?? this.editorContext.modelRoot;
    } catch {
      return;
    }
  }

  handle(action: Action): void {
    if (SetModelAction.is(action) || UpdateModelAction.is(action)) {
      this.actionDispatcher.dispatch(SetUIExtensionVisibilityAction.create({ extensionId: QueryDevTools.ID, visible: true }));
    }
  }
}
