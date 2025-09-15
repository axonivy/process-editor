import { IvyIcons } from '@axonivy/ui-icons';
import { Action, PaletteItem } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { type ToolBarButton, ToolBarButtonLocation, type ToolBarButtonProvider } from '../button';
import { ShowToolBarMenuAction } from '../tool-bar-menu';
import { ElementsPaletteHandler } from './action-handler';

@injectable()
export abstract class CreateElementsButtonProvider implements ToolBarButtonProvider {
  @inject(ElementsPaletteHandler) protected paletteHandler!: ElementsPaletteHandler;

  button() {
    return this.createToolBarButton(this.paletteItems());
  }

  protected actions = (paletteItem: PaletteItem): Action[] => [
    ShowToolBarMenuAction.create({ id: '', paletteItems: () => [], actions: () => [] }),
    ...paletteItem.actions
  ];

  protected paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems();
  }

  abstract createToolBarButton(paletteItems: () => PaletteItem[]): ToolBarButton;
}

@injectable()
export class AllElementsButtonProvider extends CreateElementsButtonProvider {
  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'all_elements_menu';
    return {
      icon: IvyIcons.Task,
      title: t('toolbar.allElements'),
      sorting: 'A',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions, showSearch: true }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class EventsButtonProvider extends CreateElementsButtonProvider {
  override paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id.match(/event-[a-z]+-group/));
  }

  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'events_menu';
    return {
      icon: IvyIcons.Start,
      title: t('toolbar.events'),
      sorting: 'B',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class GatewaysButtonProvider extends CreateElementsButtonProvider {
  override paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id === 'gateway-group');
  }

  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'gateways_menu';
    return {
      icon: IvyIcons.GatewaysGroup,
      title: t('toolbar.gateways'),
      sorting: 'C',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class ActivitiesButtonProvider extends CreateElementsButtonProvider {
  override paletteItems(): () => PaletteItem[] {
    return () =>
      this.paletteHandler
        .getPaletteItems()
        .filter(item => item.id === 'activity-group' || item.id === 'interface-activity-group' || item.id === 'bpmn-activity-group');
  }

  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'activities_menu';
    return {
      icon: IvyIcons.ActivitiesGroup,
      title: t('toolbar.activities'),
      sorting: 'D',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class ArtifactsButtonProvider extends CreateElementsButtonProvider {
  override paletteItems(): () => PaletteItem[] {
    return () => this.paletteHandler.getPaletteItems().filter(item => item.id === 'swimlane-group' || item.id === 'annotation-group');
  }

  createToolBarButton(paletteItems: () => PaletteItem[]) {
    const id = 'artifacts_menu';
    return {
      icon: IvyIcons.PoolSwimlanes,
      title: t('toolbar.artifacts'),
      sorting: 'E',
      action: () => ShowToolBarMenuAction.create({ id, paletteItems, actions: this.actions }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}

@injectable()
export class ExtensionButtonProvider extends CreateElementsButtonProvider {
  createToolBarButton() {
    const id = 'extensions_menu';
    return {
      icon: IvyIcons.Extension,
      title: t('toolbar.extensions'),
      sorting: 'F',
      action: () =>
        ShowToolBarMenuAction.create({
          id,
          paletteItems: () => this.paletteHandler.getExtensionItems(),
          actions: this.actions,
          showSearch: true,
          customCssClass: 'menu-as-list'
        }),
      id: `btn_${id}`,
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true
    };
  }
}
