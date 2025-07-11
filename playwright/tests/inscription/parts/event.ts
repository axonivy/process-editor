import type { ScriptInput } from '../../page-objects/inscription/code-editor';
import type { Combobox } from '../../page-objects/inscription/combobox';
import type { Part } from '../../page-objects/inscription/part';
import type { RadioGroup } from '../../page-objects/inscription/radio-group';
import type { Section } from '../../page-objects/inscription/section';
import type { Select } from '../../page-objects/inscription/select';
import { NewPartTest, PartObject } from './part-tester';

class Event extends PartObject {
  javaSection: Section;
  javaClass: Combobox;

  eventSection: Section;
  eventId: ScriptInput;

  expirySection: Section;
  duration: ScriptInput;
  errorTimeout: Select;
  action: RadioGroup;

  constructor(part: Part) {
    super(part);
    this.javaSection = part.section('Java Class');
    this.javaClass = this.javaSection.combobox();

    this.eventSection = part.section('Event ID');
    this.eventId = this.eventSection.scriptInput();

    this.expirySection = part.section('Expiry');
    this.duration = this.expirySection.scriptInput('Duration');
    this.errorTimeout = this.expirySection.select({ label: 'Error' });
    this.action = part.radioGroup();
  }

  async fill() {
    await this.javaSection.expectIsOpen();
    await this.javaClass.choose('ch.ivyteam.ivy.process.intermediateevent.AbstractProcessIntermediateEventBean');
    await this.eventSection.expectIsOpen();
    await this.eventId.fill('123');

    await this.expirySection.toggle();
    await this.duration.fill('3');
    await this.errorTimeout.choose('ivy:expiry:intermediate');
    await this.action.choose('Delete the Task');
  }

  async assertFill() {
    await this.javaClass.expectValue('ch.ivyteam.ivy.process.intermediateevent.AbstractProcessIntermediateEventBean');
    await this.eventId.expectValue('123');

    await this.expirySection.expectIsOpen();
    await this.duration.expectValue('3');
    await this.errorTimeout.expectValue('ivy:expiry:intermediate');
    await this.action.expectSelected('Delete the Task');
  }

  async clear() {
    await this.eventId.clear();

    await this.duration.clear();
    await this.errorTimeout.choose('ivy:expiry:intermediate');
    await this.action.choose('Do nothing');
  }

  async assertClear() {
    await this.javaClass.expectValue('ch.ivyteam.ivy.process.intermediateevent.AbstractProcessIntermediateEventBean');
    await this.eventSection.expectIsOpen();
    await this.eventId.expectEmpty();
    await this.expirySection.expectIsClosed();
  }
}

export const EventTest = new NewPartTest('Event', (part: Part) => new Event(part));
