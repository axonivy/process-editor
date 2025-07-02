import type { MacroEditor } from './code-editor';
import type { Section } from './section';
import type { Part } from './part';

export class InfoComponent {
  detailSection: Section;
  name: MacroEditor;
  description: MacroEditor;
  category: MacroEditor;

  constructor(readonly part: Part) {
    this.detailSection = part.section('Name / Description');
    this.name = this.detailSection.macroInput('Name');
    this.description = this.detailSection.macroArea('Description');
    this.category = this.detailSection.macroInput('Category');
  }

  async fill(name = 'info name') {
    await this.detailSection.expectIsOpen();
    await this.name.fill(name);
    await this.description.fill('info desc');
    await this.category.fill('info cat');
  }

  async expectFill(name = 'info name') {
    await this.name.expectValue(name);
    await this.description.expectValue('info desc');
    await this.category.expectValue('info cat');
  }

  async clear() {
    await this.name.clear();
    await this.description.clear();
    await this.category.clear();
  }

  async expectEmpty() {
    await this.detailSection.expectIsOpen();
    await this.name.expectEmpty();
    await this.description.expectEmpty();
    await this.category.expectEmpty();
  }
}
