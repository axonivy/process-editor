import { expect, type Locator, type Page } from '@playwright/test';
import { Menu, OptionsMenu } from './menu';

export type ElementPaletteGroup = 'all_elements' | 'events' | 'gateways' | 'activities' | 'artifacts' | 'extensions';
export type MenuBtn = `${ElementPaletteGroup}_menu` | 'options_menu';
export type ToolBtn = 'default_tools' | 'marquee_tools';

export class Toolbar {
  protected readonly page: Page;
  protected readonly toolbar: Locator;
  protected readonly toolbarMenu: Menu;
  protected readonly optionsMenu: OptionsMenu;
  protected readonly defaultTool: Locator;
  protected readonly marqueeTool: Locator;
  protected readonly optionsBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.toolbar = this.page.locator('#ivy-tool-bar');
    this.toolbarMenu = new Menu(page, this.toolbar.locator('.tool-bar-menu'));
    this.optionsMenu = new OptionsMenu(page, this.toolbar.locator('.tool-bar-options-menu'));
    this.defaultTool = this.toolbar.locator('#btn_default_tools');
    this.marqueeTool = this.toolbar.locator('#btn_marquee_tools');
    this.optionsBtn = this.toolbar.locator('#btn_options_menu');
  }

  locator() {
    return this.toolbar;
  }

  menu() {
    return this.toolbarMenu;
  }

  options() {
    return this.optionsMenu;
  }

  marquee() {
    return this.page.locator('.marquee-mode');
  }

  async triggerMarquee() {
    await this.marqueeTool.click();
    await this.expectActiveButton('marquee_tools');
  }

  async triggerDefault() {
    await this.defaultTool.click();
    await this.expectActiveButton('default_tools');
  }

  undoButton() {
    return this.toolbar.locator('#btn_undo_tools');
  }

  redoButton() {
    return this.toolbar.locator('#btn_redo_tools');
  }

  async triggerOptions() {
    await this.optionsBtn.click();
  }

  async triggerElementPalette(group: ElementPaletteGroup) {
    await this.toolbar.locator(`#btn_${group}_menu`).click();
  }

  async visible() {
    await expect(this.toolbar).toBeVisible();
  }

  async triggerCreateElement(group: ElementPaletteGroup, type: string) {
    await this.openElementPalette(group);
    await this.toolbarMenu.click(type);
    await this.toolbarMenu.expectHidden();
  }

  async openElementPalette(group: ElementPaletteGroup) {
    await this.triggerElementPalette(group);
    await this.toolbarMenu.expectVisible();
    await this.expectActiveButton(`${group}_menu`);
    return this.menu();
  }

  async openOptionsMenu() {
    await this.triggerOptions();
    await this.optionsMenu.expectVisible();
    await this.expectActiveButton('options_menu');
    return this.options();
  }

  async expectActiveButton(button: MenuBtn | ToolBtn) {
    const activeBtn = this.toolbar.locator('button[data-state="on"]');
    await expect(activeBtn).toHaveCount(1);
    await expect(this.toolbar.locator('button[data-state="on"]')).toHaveId(`btn_${button}`);
  }

  async expectEditMode() {
    await expect(this.defaultTool).toBeVisible();
    await expect(this.optionsBtn).toBeVisible();
    await expect(this.toolbar.locator('.edit-buttons')).toBeVisible();
    await expect(this.toolbar.locator('.middle-buttons button')).toHaveCount(6);
  }

  async expectReadonly() {
    await expect(this.defaultTool).toBeVisible();
    await expect(this.optionsBtn).toBeVisible();
    await expect(this.toolbar.locator('.edit-buttons')).toBeHidden();
    await expect(this.toolbar.locator('.middle-buttons > span')).toBeHidden();
  }
}
