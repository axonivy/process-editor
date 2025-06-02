import type { ScriptInput } from '../../page-objects/inscription/code-editor';
import type { Part } from '../../page-objects/inscription/part';
import type { ResponsibleComponent } from '../../page-objects/inscription/responsible-component';
import type { Section } from '../../page-objects/inscription/section';
import type { Checkbox } from '../../page-objects/inscription/checkbox';
import { NewPartTest, PartObject } from './part-tester';

class Trigger extends PartObject {
  triggerable: Checkbox;
  responsible: ResponsibleComponent;
  options: Section;
  attach: Checkbox;
  delay: ScriptInput;

  constructor(part: Part) {
    super(part);
    this.triggerable = part.checkbox('Yes, this can be started with a Trigger Activity');
    this.responsible = part.responsibleSection();
    this.options = part.section('Options');
    this.attach = part.checkbox('Attach to Business Case that triggered this process');
    this.delay = part.scriptInput('Delay');
  }

  async fill() {
    await this.triggerable.click();
    await this.responsible.fill('Role from Attribute', 'Test');
    await this.options.expectIsClosed();
    await this.options.toggle();
    await this.attach.click();
    await this.delay.fill('1d');
  }

  async assertFill() {
    await this.triggerable.expectChecked();
    await this.responsible.expectFill('Role from Attribute', 'Test');
    await this.options.expectIsOpen();
    await this.attach.expectUnchecked();
    await this.delay.expectValue('1d');
  }

  async clear() {
    await this.responsible.clear();
    await this.options.expectIsOpen();
    await this.attach.click();
    await this.delay.clear();
    await this.triggerable.click();
  }

  async assertClear() {
    await this.triggerable.expectUnchecked();
    await this.triggerable.click();
    await this.responsible.expectEmpty();
    await this.options.expectIsClosed();
    await this.options.toggle();
    await this.attach.expectChecked();
    await this.delay.expectEmpty();
    await this.triggerable.click();
  }
}

export const TriggerTest = new NewPartTest('Trigger', (part: Part) => new Trigger(part));
