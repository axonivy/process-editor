import type { Part } from '../../page-objects/inscription/part';
import { NewPartTest, PartObject } from './part-tester';
import type { Section } from '../../page-objects/inscription/section';
import type { Combobox } from '../../page-objects/inscription/combobox';

class ProgramInterfaceStart extends PartObject {
  javaSection: Section;
  javaClass: Combobox;
  beanClass: string;

  constructor(part: Part, beanClass: string) {
    super(part);
    this.javaSection = part.section('Java Class');
    this.javaClass = this.javaSection.combobox();
    this.beanClass = beanClass;
  }

  async fill() {
    await this.javaSection.open();
    await this.javaClass.choose(this.beanClass);
  }

  async assertFill() {
    await this.javaClass.expectValue(this.beanClass);
  }

  async clear() {
    await this.javaClass.fill('');
  }

  async assertClear() {
    await this.javaSection.open();
    await this.javaClass.expectValue('');
  }
}

export const ProgramInterfaceStartTest = new NewPartTest(
  'Java Bean',
  (part: Part) => new ProgramInterfaceStart(part, 'com.axonivy.wf.custom.ErpLoader')
);
