import type { Part } from '../../page-objects/inscription/part';
import { NewPartTest, PartObject } from './part-tester';
import type { Checkbox } from '../../page-objects/inscription/checkbox';
import type { Section } from '../../page-objects/inscription/section';
import type { Select } from '../../page-objects/inscription/select';
import type { Tags } from '../../page-objects/inscription/tags';
import type { ScriptInput } from '../../page-objects/inscription/code-editor';

class WebService extends PartObject {
  permissionSection: Section;
  roles: Tags;
  error: Select;
  exceptionSection: Section;
  useExceptionHandling: Checkbox;
  condition: ScriptInput;
  message: ScriptInput;

  constructor(part: Part) {
    super(part);
    this.permissionSection = part.section('Permission');
    this.roles = this.permissionSection.tags();
    this.error = this.permissionSection.select({ label: 'Violation error' });
    this.exceptionSection = part.section('Exception');
    this.useExceptionHandling = this.exceptionSection.checkbox('Use exception handling');
    this.condition = this.exceptionSection.scriptInput('Condition');
    this.message = this.exceptionSection.scriptInput('Message');
  }

  async fill() {
    await this.permissionSection.toggle();
    await this.roles.chooseTags(['Support']);
    await this.error.choose('>> Ignore Exception');

    await this.exceptionSection.toggle();
    await this.useExceptionHandling.click();
    await this.condition.fill('0===0');
    await this.message.fill('hallo');
  }

  async assertFill() {
    await this.permissionSection.expectIsOpen();
    await this.roles.expectTags(['Support']);
    await this.error.expectValue('>> Ignore Exception');

    await this.exceptionSection.expectIsOpen();
    await this.useExceptionHandling.expectChecked();
    await this.condition.expectValue('0===0');
    await this.message.expectValue('hallo');
  }

  async clear() {
    await this.roles.clearTags(['Support']);
    await this.error.choose('ivy:security:forbidden');

    await this.useExceptionHandling.click();
    await this.condition.clear();
    await this.message.clear();
  }

  async assertClear() {
    await this.permissionSection.expectIsClosed();
    await this.exceptionSection.expectIsClosed();
  }
}

export const WebServiceTest = new NewPartTest('Web Service', (part: Part) => new WebService(part));
