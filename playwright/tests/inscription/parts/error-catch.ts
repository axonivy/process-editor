import type { Combobox } from '../../page-objects/inscription/combobox';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import { NewPartTest, PartObject } from './part-tester';

class ErrorCatch extends PartObject {
  section: Section;
  error: Combobox;

  constructor(part: Part) {
    super(part);
    this.section = part.section('Error Code');
    this.error = this.section.combobox();
  }

  async fill() {
    await this.section.expectIsOpen();
    await this.error.choose('ivy:error');
  }

  async assertFill() {
    await this.error.expectValue('ivy:error');
  }

  async clear() {
    await this.error.choose('');
  }

  async assertClear() {
    await this.section.expectIsOpen();
  }
}

export const ErrorCatchTest = new NewPartTest('Error', (part: Part) => new ErrorCatch(part));
