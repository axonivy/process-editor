import type { Part } from '../../page-objects/inscription/part';
import { NewPartTest, PartObject } from './part-tester';
import type { Section } from '../../page-objects/inscription/section';
import type { Select } from '../../page-objects/inscription/select';
import type { ScriptInput } from '../../page-objects/inscription/code-editor';

class ProgramInterfaceError extends PartObject {
  programSection: Section;
  errorProgram: Select;

  timeoutSection: Section;
  seconds: ScriptInput;
  errorTimeout: Select;

  constructor(part: Part) {
    super(part);
    this.programSection = part.section('Error');
    this.errorProgram = this.programSection.select({});

    this.timeoutSection = part.section('Timeout');
    this.seconds = this.timeoutSection.scriptInput('Seconds');
    this.errorTimeout = this.timeoutSection.select({ label: 'Error' });
  }

  async fill() {
    await this.programSection.expectIsOpen();
    await this.errorProgram.choose('>> Ignore Exception');

    await this.timeoutSection.toggle();
    await this.seconds.fill('3');
    await this.errorTimeout.choose('>> Ignore Exception');
  }

  async assertFill() {
    await this.programSection.expectIsOpen();
    await this.errorProgram.expectValue('>> Ignore Exception');

    await this.timeoutSection.expectIsOpen();
    await this.seconds.expectValue('3');
    await this.errorTimeout.expectValue('>> Ignore Exception');
  }

  async clear() {
    await this.errorProgram.choose('ivy:error:program:exception');

    await this.seconds.clear();
    await this.errorTimeout.choose('ivy:error:program:timeout');
  }

  async assertClear() {
    await this.programSection.expectIsOpen();
    await this.timeoutSection.expectIsClosed();
  }
}

export const ProgramInterfaceErrorTest = new NewPartTest('Error', (part: Part) => new ProgramInterfaceError(part));
