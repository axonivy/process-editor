import { EditorContextService, GLSPAbstractUIExtension, GModelRoot } from '@eclipse-glsp/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { inject, injectable } from 'inversify';
import * as React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { IVY_TYPES } from '../types';

@injectable()
export abstract class ReactUIExtension extends GLSPAbstractUIExtension {
  @inject(EditorContextService) protected editorContext!: EditorContextService;
  @inject(IVY_TYPES.QueryClient) protected queryClient!: QueryClient;

  protected nodeRoot?: Root;
  protected currentRoot?: Readonly<GModelRoot>;
  protected currentContextElementIds?: string[];

  protected initializeContents(containerElement: HTMLElement): void {
    this.nodeRoot = createRoot(containerElement);
    // once initialized and added to the DOM, we do not remove the UI extension from the DOM again
    // if we were to do that, we should make sure to call this.nodeRoot.unmount()
  }

  protected abstract render(root: Readonly<GModelRoot>, ...contextElementIds: string[]): React.ReactNode;

  protected override onBeforeShow(containerElement: HTMLElement, root: Readonly<GModelRoot>, ...contextElementIds: string[]): void {
    this.currentRoot = root;
    this.currentContextElementIds = contextElementIds;
    super.onBeforeShow(containerElement, root, ...contextElementIds);
    this.update();
  }

  protected override setContainerVisible(visible: boolean): void {
    super.setContainerVisible(visible);
    this.update();
  }

  protected update(): void {
    const root = this.currentRoot ?? this.editorContext.modelRoot;
    const contextElementIds = this.currentContextElementIds ?? [];
    if (this.nodeRoot) {
      this.nodeRoot.render(
        <React.Fragment>
          <React.StrictMode>
            <QueryClientProvider client={this.queryClient}>{this.render(root, ...contextElementIds)}</QueryClientProvider>
          </React.StrictMode>
        </React.Fragment>
      );
    }
  }
}
