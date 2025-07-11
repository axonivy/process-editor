import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import type { TextArea } from '../../page-objects/inscription/text-area';
import { NewPartTest, PartObject } from './part-tester';

class EndPage extends PartObject {
  section: Section;
  endPage: TextArea;

  constructor(part: Part) {
    super(part);
    this.section = part.section('End Page');
    this.endPage = this.section.textArea({});
  }

  async fill() {
    await this.section.expectIsOpen();
    await this.endPage.fill('page.xhtml');
  }

  async assertFill() {
    await this.endPage.expectValue('page.xhtml');
  }

  async clear() {
    await this.endPage.clear();
  }

  async assertClear() {
    await this.section.expectIsOpen();
    await this.endPage.expectEmpty();
  }
}

export const EndPageTest = new NewPartTest('End Page', (part: Part) => new EndPage(part));
