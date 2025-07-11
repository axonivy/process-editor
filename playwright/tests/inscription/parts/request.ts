import type { Checkbox } from '../../page-objects/inscription/checkbox';
import type { InfoComponent } from '../../page-objects/inscription/info-component';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import type { Select } from '../../page-objects/inscription/select';
import type { Table } from '../../page-objects/inscription/table';
import type { Tags } from '../../page-objects/inscription/tags';
import { NewPartTest, PartObject } from './part-tester';

class Request extends PartObject {
  httpable: Checkbox;
  startList: Checkbox;
  info: InfoComponent;
  customFieldSection: Section;
  customFields: Table;
  permissionSection: Section;
  anonym: Checkbox;
  roles: Tags;
  error: Select;

  constructor(part: Part) {
    super(part);
    this.httpable = part.checkbox('Yes, this can be started with a HTTP-Request / -Link');
    this.startList = part.checkbox('Show on start list');
    this.info = part.infoComponent();
    this.customFieldSection = part.section('Custom Fields');
    this.customFields = this.customFieldSection.table(['combobox', 'expression']);
    this.permissionSection = part.section('Permission');
    this.anonym = this.permissionSection.checkbox('Allow anonymous');
    this.roles = this.permissionSection.tags();
    this.error = this.permissionSection.select({ label: 'Violation error' });
  }

  async fill() {
    await this.info.fill();
    await this.customFieldSection.toggle();
    const customField = await this.customFields.addRow();
    await customField.fill(['field', 'value']);
    await this.permissionSection.toggle();
    await this.anonym.click();
    await this.roles.chooseTags(['Support']);
    await this.error.choose('>> Ignore Exception');
    await this.startList.click();
    await this.httpable.click();
  }

  async assertFill() {
    await this.httpable.expectUnchecked();
    await this.httpable.click();
    await this.startList.expectUnchecked();
    await this.startList.click();
    await this.info.expectFill();
    await this.customFieldSection.expectIsOpen();
    await this.customFields.row(0).expectValues(['field', 'value']);
    await this.permissionSection.expectIsOpen();
    await this.anonym.expectUnchecked();
    await this.roles.expectTags(['Support']);
    await this.error.expectValue('>> Ignore Exception');
  }

  async clear() {
    await this.httpable.expectChecked();
    await this.startList.expectChecked();
    await this.info.clear();
    await this.customFields.clear();
    await this.roles.clearTags(['Support']);
    await this.anonym.click();
    await this.error.choose('ivy:security:forbidden');
  }

  async assertClear() {
    await this.httpable.expectChecked();
    await this.startList.expectChecked();
    await this.info.expectEmpty();
    await this.customFieldSection.expectIsClosed();
    await this.permissionSection.expectIsClosed();
  }
}

export const RequestTest = new NewPartTest('Request', (part: Part) => new Request(part));
