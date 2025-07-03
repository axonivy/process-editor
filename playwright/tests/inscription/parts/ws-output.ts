import type { Part } from '../../page-objects/inscription/part';
import { NewPartTest, PartObject } from './part-tester';
import type { Section } from '../../page-objects/inscription/section';
import type { Table } from '../../page-objects/inscription/table';
import type { ScriptArea } from '../../page-objects/inscription/code-editor';

class WsOutput extends PartObject {
  mappingSection: Section;
  mapping: Table;
  codeSection: Section;
  code: ScriptArea;

  constructor(part: Part) {
    super(part);
    this.mappingSection = part.section('Mapping');
    this.mapping = this.mappingSection.table(['label', 'expression']);
    this.codeSection = part.section('Code');
    this.code = this.codeSection.scriptArea();
  }

  async fill() {
    await this.mappingSection.expectIsOpen();
    await this.mapping.row(1).column(1).fill('"bla"');
    await this.codeSection.open();
    await this.code.fill('code');
  }

  async assertFill() {
    await this.mapping.row(1).column(1).expectValue('"bla"');
    await this.code.expectValue('code');
  }

  async clear() {
    await this.mapping.row(1).column(1).clearExpression();
    await this.code.clear();
  }

  async assertClear() {
    await this.mapping.row(1).column(1).expectValue('');
    await this.codeSection.expectIsClosed();
  }
}

export const WsOutputTest = new NewPartTest('Output', (part: Part) => new WsOutput(part));
