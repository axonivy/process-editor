import type { Part } from '../../page-objects/inscription/part';
import { NewPartTest, PartObject } from './part-tester';
import type { TextArea } from '../../page-objects/inscription/text-area';
import type { Section } from '../../page-objects/inscription/section';

class EndPage extends PartObject {
  section: Section;
  endPageInput: TextArea;

  constructor(part: Part) {
    super(part);
    this.section = part.section('End Page');
    this.endPageInput = this.section.textArea({});
  }

  async fill() {
    await this.section.open();
    await this.endPageInput.fill('page.xhtml');
  }

  async assertFill() {
    await this.endPageInput.expectValue('page.xhtml');
  }

  async clear() {
    await this.endPageInput.clear();
  }

  async assertClear() {
    await this.section.open();
    await this.endPageInput.expectEmpty();
  }
}

export const EndPageTest = new NewPartTest('End Page', (part: Part) => new EndPage(part));
