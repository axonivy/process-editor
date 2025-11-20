import { expect, type Locator, type Page } from '@playwright/test';
import { LabelEdit } from './label-edit';
import { ProcessEditor } from './process-editor';
import { QuickActionBar } from './quick-action-bar';
import type { Point } from './types';

export class BaseElement {
  protected readonly page: Page;
  protected element!: Locator;
  protected colorLocator!: Locator;
  protected labelLocator!: Locator;

  constructor(page: Page) {
    this.page = page;
  }

  locator() {
    return this.element;
  }

  quickActionBar() {
    return new QuickActionBar(this.page, this);
  }

  labelEdit() {
    return new LabelEdit(this.page);
  }

  async select(position?: Point) {
    if (!(await this.isSelected())) {
      await this.element.click({ position });
    }
    await this.expectSelected();
  }

  async delete() {
    await this.select();
    await this.page.keyboard.press('Delete');
    await expect(this.element).toBeHidden();
  }

  async isSelected() {
    return (await this.element.getAttribute('class'))?.includes('selected');
  }

  async expectLabel(label: string) {
    await expect(this.labelLocator).toHaveText(label);
  }

  async expectSelected() {
    await expect(this.element).toHaveClass(/selected/);
  }

  async expectNotSelected() {
    await expect(this.element).not.toHaveClass(/selected/);
  }

  async expectHighlighted() {
    await expect(this.element).toHaveClass(/executed/);
  }

  async expectColor(color?: string) {
    if (color) {
      await expect(this.colorLocator).toHaveAttribute('style', `stroke: ${color};`);
    } else {
      await expect(this.colorLocator).not.toHaveAttribute('style', /stroke: rgb(\d+, \d+, \d+);/);
    }
  }
}

export class Element extends BaseElement {
  constructor(page: Page, parentLocator: Locator, options?: { type?: string; pid?: string; id?: string }) {
    super(page);
    this.element = parentLocator;
    if (options?.type) {
      this.element = parentLocator.locator(`.${options.type.replaceAll(':', '\\:')}`);
    }
    if (options?.pid) {
      this.element = parentLocator.locator(`#sprotty_${options.pid}`);
    }
    if (options?.id) {
      this.element = parentLocator.locator(`#${options.id}`);
    }
    this.colorLocator = this.element.locator('.sprotty-node');
    this.labelLocator = this.element.locator('.sprotty-label div');
  }

  async move(position: Point) {
    await this.select();
    await this.page.mouse.down();
    await this.page.mouse.move(position.x, position.y);
    await this.page.mouse.up();
  }

  async inscribe() {
    await this.select();
    await this.element.dblclick();
    const view = ProcessEditor.inscriptionView(this.page);
    await view.expectOpen();
    return view;
  }

  async expectPosition(point: Point) {
    await expect(this.element).toHaveAttribute('transform', `translate(${point.x}, ${point.y})`);
  }

  async expectPositionIsNot(point: Point) {
    await expect(this.element).not.toHaveAttribute('transform', `translate(${point.x}, ${point.y})`);
  }

  async expectHasWarning() {
    await expect(this.element).toHaveClass(/warning/);
  }

  async getPosition() {
    const transform = await this.element.getAttribute('transform');
    if (!transform) {
      throw new Error('Element has no transform');
    }
    const position = transform.substring(transform.indexOf('(') + 1, transform.indexOf(')'));
    const x = parseInt(position.split(',')[0]!.trim(), 10);
    const y = parseInt(position.split(',')[1]!.trim(), 10);
    return { x: x, y: y };
  }

  async expectSize(width: number, height: number) {
    await expect(this.element.locator(`rect[width="${width}"][height="${height}"]`)).toBeVisible();
  }

  get icon() {
    return this.element.locator('.sprotty-icon').first();
  }
}

export class Activity extends Element {
  async expectResizeHandles(handles: number) {
    await expect(this.element.locator('.sprotty-resize-handle')).toHaveCount(handles);
  }

  getResizeHandle(dataKind: 'bottom-right' | 'top-left' | 'bottom-left' | 'top-right') {
    return this.element.locator(`.sprotty-resize-handle[data-kind="${dataKind}"]`);
  }

  async resize(handle: Locator, newHandlePoint: Point) {
    await handle.hover();
    await this.page.mouse.down();
    await this.page.mouse.move(newHandlePoint.x, newHandlePoint.y);
    await this.page.mouse.up();
  }
}

export class Lane extends Element {
  constructor(page: Page, parentLocator: Locator, options?: { type?: string; pid?: string; id?: string }) {
    super(page, parentLocator, options);
    this.element = this.element.first();
    this.colorLocator = this.element.locator('> rect');
    this.labelLocator = this.element.locator('text tspan');
  }

  override async select() {
    await super.select({ x: 5, y: 100 });
  }

  async expectResizeHandles(handles: number) {
    await expect(this.element.locator('.lane-resize-handle')).toHaveCount(handles);
  }

  override async expectColor(color?: string) {
    if (color) {
      await expect(this.colorLocator).toHaveAttribute('style', `--lane-color: ${color};`);
    } else {
      await expect(this.colorLocator).not.toHaveAttribute('style', /--lane-color: /);
    }
  }
}

export class Pool extends Lane {
  async expectEmbeddedLanes(count: number) {
    await expect(this.element.locator('.lane')).toHaveCount(count);
  }

  async createEmbeddedLane() {
    await this.quickActionBar().trigger('Create Lane');
    return new Lane(this.page, this.element, { type: 'lane' });
  }
}
