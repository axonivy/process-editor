import type { Part } from '../../page-objects/inscription/part';
import type { Select } from '../../page-objects/inscription/select';
import { NewPartTest, PartObject } from './part-tester';
import type { Section } from '../../page-objects/inscription/section';

class DbErrorPart extends PartObject {
  section: Section;
  error: Select;

  constructor(part: Part) {
    super(part);
    this.section = part.section('Error');
    this.error = this.section.select({});
  }

  async fill(): Promise<void> {
    await this.section.expectIsOpen();
    await this.error.choose('>> Ignore Exception');
  }
  async assertFill(): Promise<void> {
    await this.section.expectIsOpen();
    await this.error.expectValue('>> Ignore Exception');
  }
  async clear(): Promise<void> {
    await this.error.choose('ivy:error:database');
  }
  async assertClear(): Promise<void> {
    await this.section.expectIsOpen();
  }
}

export const DbErrorTest = new NewPartTest('Error', (part: Part) => new DbErrorPart(part));
