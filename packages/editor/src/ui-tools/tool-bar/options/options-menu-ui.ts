import { CustomIconToggleAction, SwitchThemeAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import type { Action, IActionDispatcher } from '@eclipse-glsp/client';
import { ShowGridAction } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { createElement, createIcon, ToggleSwitch } from '../../../utils/ui-utils';
import type { Menu } from '../../menu/menu';
import type { ShowToolBarOptionsMenuAction } from './action';

interface Option {
  icon: IvyIcons;
  label: string;
  action: (state: boolean) => Action;
}

class ThemeOption implements Option {
  constructor(
    public readonly icon = IvyIcons.DarkMode,
    public readonly label = t('common.label.theme'),
    public readonly action = (state: boolean) => SwitchThemeAction.create({ theme: state ? 'dark' : 'light' })
  ) {}
}

class GridOption implements Option {
  constructor(
    public readonly icon = IvyIcons.GridDots,
    public readonly label = t('toolbar.grid'),
    public readonly action = (state: boolean) => ShowGridAction.create({ show: state })
  ) {}
}

class CustomIconOption implements Option {
  constructor(
    public readonly icon = IvyIcons.CustomImage,
    public readonly label = t('toolbar.customIcon'),
    public readonly action = (state: boolean) => CustomIconToggleAction.create({ showCustomIcons: state })
  ) {}
}

export class ToolBarOptionsMenu implements Menu {
  private bodyDiv?: HTMLDivElement;

  constructor(
    readonly actionDispatcher: IActionDispatcher,
    readonly showAction: ShowToolBarOptionsMenuAction
  ) {}

  public create(containerElement: HTMLElement): HTMLElement {
    this.bodyDiv = createElement('div', ['tool-bar-options-menu']) as HTMLDivElement;
    containerElement.appendChild(this.bodyDiv);
    this.bodyDiv.appendChild(this.createHeader());
    this.bodyDiv.appendChild(this.createOptions());
    const optionsBtn = document.querySelector<HTMLDivElement>('#btn_options_menu');
    if (optionsBtn) {
      const containerWidth = containerElement.offsetWidth;
      const buttonCenter = optionsBtn.offsetLeft + optionsBtn.offsetWidth / 2;
      this.bodyDiv.style.setProperty('--menu-arrow-pos', `${containerWidth - buttonCenter - 15}px`);
    }
    return this.bodyDiv;
  }

  createHeader(): HTMLElement {
    const header = createElement('div', ['tool-bar-options-header']);
    header.appendChild(createIcon(IvyIcons.Settings));
    const label = document.createElement('label');
    label.textContent = t('common.label.settings');
    header.appendChild(label);
    return header;
  }

  createOptions(): HTMLElement {
    const options = createElement('div', ['tool-bar-options']);
    if (this.showAction.theme) {
      options.appendChild(this.createOption(new ThemeOption(), this.showAction.theme() === 'dark'));
    }
    options.appendChild(this.createOption(new GridOption(), this.showAction.grid()));
    options.appendChild(this.createOption(new CustomIconOption(), this.showAction.customIconState()));
    return options;
  }

  createOption(setting: Option, state: boolean): HTMLElement {
    const option = createElement('div', ['tool-bar-option']);
    option.appendChild(createIcon(setting.icon));
    const label = document.createElement('label');
    label.textContent = setting.label;
    option.appendChild(label);
    const toggle = new ToggleSwitch(state, newState => this.actionDispatcher.dispatch(setting.action(newState)));
    option.appendChild(toggle.create());
    label.onclick = () => toggle.switch();
    return option;
  }

  public remove(): void {
    this.bodyDiv?.remove();
  }
}
