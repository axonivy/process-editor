import type { Checkbox } from '../../page-objects/inscription/checkbox';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import { NewPartTest, PartObject } from './part-tester';

class Permissions extends PartObject {
  section: Section;
  viewable: Checkbox;

  constructor(
    part: Part,
    readonly defaultIsChecked: boolean
  ) {
    super(part);
    this.section = part.section('Permissions');
    this.viewable = this.section.checkbox('Allow all workflow users to view the process on the Engine');
  }

  async fill() {
    await this.section.expectIsOpen();
    await this.viewable.click();
  }

  async assertFill() {
    if (this.defaultIsChecked) {
      await this.viewable.expectUnchecked();
    } else {
      await this.viewable.expectChecked();
    }
  }

  async clear() {
    await this.viewable.click();
  }

  async assertClear() {
    await this.section.expectIsOpen();
  }
}

export const PermissionsTest = (defaultIsChecked = true) =>
  new NewPartTest('Permissions', (part: Part) => new Permissions(part, defaultIsChecked));
