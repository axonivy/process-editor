import type { Part } from '../../page-objects/inscription/part';
import { NewPartTest, PartObject } from './part-tester';
import type { Section } from '../../page-objects/inscription/section';
import type { Combobox } from '../../page-objects/inscription/combobox';

class RestError extends PartObject {
  errorSection: Section;
  clientError: Combobox;
  statusError: Combobox;

  constructor(part: Part) {
    super(part);
    this.errorSection = part.section('Error');
    this.clientError = this.errorSection.combobox('On Error (Connection, Timeout, etc.)');
    this.statusError = this.errorSection.combobox('On Status Code not successful (2xx)');
  }

  async fill() {
    await this.errorSection.expectIsOpen();
    await this.clientError.choose('>> Ignore error');
    await this.statusError.choose('>> Ignore error');
  }

  async assertFill() {
    await this.errorSection.expectIsOpen();
    await this.clientError.expectValue('>> Ignore error');
    await this.statusError.expectValue('>> Ignore error');
  }

  async clear() {
    await this.clientError.choose('ivy:error:rest:client');
    await this.statusError.choose('ivy:error:rest:client');
  }

  async assertClear() {
    await this.errorSection.expectIsOpen();
  }
}

export const RestErrorTest = new NewPartTest('Error', (part: Part) => new RestError(part));
