import { ScriptInput } from './code-editor';
import { Select } from './select';
import type { Section } from './section';
import type { Part } from './part';
import { Tags } from './tags';

type ResponsibleTypes = 'Role from Attribute' | 'User from Attribute' | 'Member from Attribute' | 'Roles' | 'Nobody & delete';

export class ResponsibleComponent {
  typeSelect: Select;
  script: ScriptInput;
  tags: Tags;

  constructor(part: Part | Section) {
    const locator = part.currentLocator().locator('.responsible-select').first();
    this.typeSelect = new Select(part.page, locator, { nth: 0 });
    this.script = new ScriptInput(part.page, locator);
    this.tags = new Tags(part.page, locator);
  }

  async fill(type: ResponsibleTypes, responsible = '') {
    await this.typeSelect.choose(type);
    switch (type) {
      case 'Role from Attribute':
      case 'User from Attribute':
        await this.script.fill(responsible);
        break;
      case 'Roles':
        await this.tags.chooseTags([responsible]);
        break;
      case 'Nobody & delete':
    }
  }

  async expectFill(type: ResponsibleTypes, responsible = '') {
    await this.typeSelect.expectValue(type);
    switch (type) {
      case 'Role from Attribute':
      case 'User from Attribute':
        await this.script.expectValue(responsible);
        break;
      case 'Roles':
        await this.tags.expectTags([responsible]);
        break;
      case 'Nobody & delete':
    }
  }

  async clear() {
    await this.typeSelect.choose('Roles');
    await this.tags.clearTags([]);
  }

  async expectEmpty() {
    await this.typeSelect.expectValue('Roles');
    await this.tags.expectTags(['Everybody']);
  }
}

export class ResponsibleSection extends ResponsibleComponent {
  readonly section: Section;

  constructor(part: Part | Section) {
    super(part);
    this.section = part.section('Responsible');
    this.typeSelect = this.section.select({ nth: 0 });
    this.script = this.section.scriptInput();
  }

  override async fill(type: ResponsibleTypes, responsible?: string) {
    await this.section.open();
    await super.fill(type, responsible);
  }

  override async expectFill(type: ResponsibleTypes, responsible?: string) {
    await super.expectFill(type, responsible);
  }

  override async clear() {
    await super.clear();
  }

  override async expectEmpty() {
    await this.section.expectIsClosed();
  }
}
