import type { MacroEditor } from '../../page-objects/inscription/code-editor';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import type { Select } from '../../page-objects/inscription/select';
import { NewPartTest, PartObject } from './part-tester';

class MailContent extends PartObject {
  section: Section;
  type: Select;
  message: MacroEditor;

  constructor(part: Part) {
    super(part);
    this.section = part.section('Content');
    this.type = this.section.select({ label: 'Type' });
    this.message = this.section.macroArea('Message');
  }

  async fill() {
    await this.section.expectIsOpen();
    await this.type.choose('text/html');
    await this.message.fill('Hello\nWorld');
  }
  async assertFill() {
    await this.type.expectValue('text/html');
    await this.message.expectValue('Hello\nWorld');
  }
  async clear() {
    await this.type.choose('text/plain');
    await this.message.clear();
  }
  async assertClear() {
    await this.section.expectIsOpen();
  }
}

export const MailContentTest = new NewPartTest('Content', (part: Part) => new MailContent(part));
