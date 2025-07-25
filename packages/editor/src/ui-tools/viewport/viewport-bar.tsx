import {
  Action,
  CenterAction,
  FitToScreenAction,
  type IActionDispatcher,
  type IActionHandler,
  isViewport,
  type IToolManager,
  OriginViewportAction,
  SelectionService,
  SetUIExtensionVisibilityAction,
  SetViewportAction,
  TYPES
} from '@eclipse-glsp/client';
import { inject, injectable } from 'inversify';

import { EnableViewportAction, SetViewportZoomAction } from '@axonivy/process-editor-protocol';
import { Button, Flex, Separator } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { t } from 'i18next';
import React from 'react';
import { ReactUIExtension } from '../../utils/react-ui-extension';
import { QuickActionUI } from '../quick-action/quick-action-ui';

@injectable()
export class ViewportBar extends ReactUIExtension implements IActionHandler {
  static readonly ID = 'ivy-viewport-bar';

  @inject(TYPES.IActionDispatcher) protected readonly actionDispatcher: IActionDispatcher;
  @inject(TYPES.IToolManager) protected readonly toolManager: IToolManager;
  @inject(SelectionService) protected selectionService: SelectionService;

  protected zoomLevel = '100%';

  id(): string {
    return ViewportBar.ID;
  }

  containerClass(): string {
    return ViewportBar.ID;
  }

  protected initializeContainer(container: HTMLElement): void {
    super.initializeContainer(container);
    container.onwheel = ev => (ev.ctrlKey ? ev.preventDefault() : true);
  }

  protected render(): React.ReactNode {
    return (
      <Flex direction='row' alignItems='center' gap={1} className='viewport-bar'>
        <Button
          id='originBtn'
          icon={IvyIcons.WindowMinimize}
          title={t('viewport.origin', { hotkey: 'O' })}
          size='large'
          onClick={() => this.onAction(OriginViewportAction.create())}
        />
        <Button
          id='fitToScreenBtn'
          icon={IvyIcons.FitToScreen}
          title={t('viewport.fitToScreen', { hotkey: 'F' })}
          size='large'
          onClick={() => this.onAction(FitToScreenAction.create([], { padding: 10 }))}
        />
        <Button
          id='centerBtn'
          icon={IvyIcons.Center}
          title={t('viewport.center', { hotkey: 'M' })}
          size='large'
          onClick={() => this.onAction(CenterAction.create([...this.selectionService.getSelectedElementIDs()]))}
        />
        <Separator orientation='vertical' style={{ height: '26px', marginInline: 0 }} />
        <span className='viewport-bar-zoom'>{this.zoomLevel}</span>
      </Flex>
    );
  }

  protected async onAction(action: Action): Promise<void> {
    await this.actionDispatcher.dispatch(action);
    const model = this.editorContext.modelRoot;
    if (isViewport(model)) {
      this.actionDispatcher.dispatchAll([
        QuickActionUI.show([...this.selectionService.getSelectedElementIDs()]),
        SetViewportAction.create(model.id, model, {})
      ]);
    }
  }

  handle(action: Action) {
    if (EnableViewportAction.is(action)) {
      this.actionDispatcher.dispatch(SetUIExtensionVisibilityAction.create({ extensionId: ViewportBar.ID, visible: true }));
    }
    if (SetViewportAction.is(action)) {
      this.updateZoomLevel(action.newViewport.zoom);
    } else if (SetViewportZoomAction.is(action)) {
      this.updateZoomLevel(action.zoom);
    }
  }

  private updateZoomLevel(zoom: number): void {
    this.zoomLevel = (zoom * 100).toFixed(0).toString() + '%';
    this.update();
  }
}
