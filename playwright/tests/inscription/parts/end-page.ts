import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import type { TextArea } from '../../page-objects/inscription/text-area';
import { NewPartTest, PartObject } from './part-tester';

class EndPage extends PartObject {
  section: Section;
  endPageInput: TextArea;

  constructor(part: Part) {
    super(part);
    this.section = part.section('End Page');
    this.endPageInput = this.section.textArea({});
  }

  async fill() {
    await this.section.expectIsOpen();
    await this.endPageInput.fill('page.xhtml');
  }

  async assertFill() {
    await this.endPageInput.expectValue('page.xhtml');
  }

  async clear() {
    await this.endPageInput.clear();
  }

  async assertClear() {
    await this.section.expectIsOpen();
    await this.endPageInput.expectEmpty();
  }
}

export const EndPageTest = new NewPartTest('End Page', (part: Part) => new EndPage(part));
