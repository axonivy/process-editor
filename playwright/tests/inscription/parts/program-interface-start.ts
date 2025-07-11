import type { Combobox } from '../../page-objects/inscription/combobox';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import { NewPartTest, PartObject } from './part-tester';

class ProgramInterfaceStart extends PartObject {
  javaSection: Section;
  javaClass: Combobox;

  constructor(part: Part) {
    super(part);
    this.javaSection = part.section('Java Class');
    this.javaClass = this.javaSection.combobox();
  }

  async fill() {
    await this.javaSection.expectIsOpen();
    await this.javaClass.choose('ch.ivyteam.ivy.process.extension.impl.AbstractUserProcessExtension');
  }

  async assertFill() {
    await this.javaClass.expectValue('ch.ivyteam.ivy.process.extension.impl.AbstractUserProcessExtension');
  }

  async clear() {
    await this.javaClass.fill('');
  }

  async assertClear() {
    await this.javaSection.open();
    await this.javaClass.expectValue('');
  }
}

export const ProgramInterfaceStartTest = new NewPartTest('Java Bean', (part: Part) => new ProgramInterfaceStart(part));
