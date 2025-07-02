import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import type { Table } from '../../page-objects/inscription/table';
import type { Tags } from '../../page-objects/inscription/tags';
import type { TextArea } from '../../page-objects/inscription/text-area';
import { NewPartTest, PartObject } from './part-tester';

class General extends PartObject {
  nameSection: Section;
  displayName: TextArea;
  description: TextArea;
  meansDocumentsSection: Section;
  documents: Table;
  tagsSection: Section;
  tags: Tags;

  constructor(
    part: Part,
    private readonly hasTags: boolean,
    private readonly nameDisabled?: boolean
  ) {
    super(part);
    this.nameSection = part.section('Name / Description');
    this.displayName = this.nameSection.textArea({ label: 'Display name' });
    this.description = this.nameSection.textArea({ label: 'Description' });
    this.meansDocumentsSection = part.section('Means / Documents');
    this.documents = this.meansDocumentsSection.table(['text', 'text']);
    this.tagsSection = part.section('Tags');
    this.tags = this.tagsSection.tags();
  }

  async fill() {
    await this.nameSection.expectIsOpen();
    if (!this.nameDisabled) {
      await this.displayName.fill('test name');
    }
    await this.description.fill('test desc');
    await this.meansDocumentsSection.toggle();
    const row = await this.documents.addRow();
    await row.fill(['test doc', 'test url']);
    if (this.hasTags) {
      await this.tagsSection.toggle();
      await this.tags.addTags(['abc', 'efg']);
    }
  }

  async assertFill() {
    if (!this.nameDisabled) {
      await this.displayName.expectValue('test name');
    }
    await this.description.expectValue('test desc');
    await this.documents.expectRowCount(1);
    await this.documents.row(0).expectValues(['test doc', 'test url']);
    if (this.hasTags) {
      await this.tags.expectTags(['abc', 'efg']);
    }
  }
  async clear() {
    if (!this.nameDisabled) {
      await this.displayName.clear();
    }
    await this.description.clear();
    await this.documents.clear();
    if (this.hasTags) {
      await this.tags.clearTags(['abc', 'efg']);
    }
  }
  async assertClear() {
    await this.nameSection.expectIsOpen();
    await this.meansDocumentsSection.expectIsClosed();
    if (this.hasTags) {
      await this.tags.expectEmpty();
    }
  }
}

export class GeneralTester extends NewPartTest {
  constructor(hasTags: boolean = true, nameDisabled = false) {
    super('General', (part: Part) => new General(part, hasTags, nameDisabled));
  }
}

export const GeneralTest = new GeneralTester();
export const GeneralTestWithoutTags = new GeneralTester(false);
export const GeneralTestWithDisabledName = new GeneralTester(false, true);
