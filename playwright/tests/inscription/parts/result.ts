import type { ScriptArea } from '../../page-objects/inscription/code-editor';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import type { Table } from '../../page-objects/inscription/table';
import { NewPartTest, PartObject } from './part-tester';

class Result extends PartObject {
  paramSection: Section;
  params: Table;
  mappingSection: Section;
  mapping: Table;
  codeSection: Section;
  code: ScriptArea;

  constructor(
    part: Part,
    private readonly hideParamDesc: boolean = false
  ) {
    super(part);
    this.paramSection = part.section('Result parameters');
    if (this.hideParamDesc) {
      this.params = this.paramSection.table(['text', 'text']);
    } else {
      this.params = this.paramSection.table(['text', 'text', 'text']);
    }
    this.mappingSection = part.section('Mapping');
    this.mapping = this.mappingSection.table(['text', 'expression']);
    this.codeSection = part.section('Code');
    this.code = this.codeSection.scriptArea();
  }

  async fill() {
    await this.paramSection.toggle();
    const paramRow = await this.params.addRow();
    if (this.hideParamDesc) {
      await paramRow.fill(['param', 'String']);
    } else {
      await paramRow.fill(['param', 'String', 'desc']);
    }
    await this.paramSection.toggle();
    await this.mappingSection.expectIsOpen();
    await this.mapping.row(1).column(1).fill('"bla"');
    await this.codeSection.open();
    await this.code.fill('code');
  }

  async assertFill() {
    await this.paramSection.toggle();
    const paramRow = this.params.row(0);
    if (this.hideParamDesc) {
      await paramRow.expectValues(['param', 'String']);
    } else {
      await paramRow.expectValues(['param', 'String', 'desc']);
    }
    await this.paramSection.toggle();
    await this.mapping.row(1).column(1).expectValue('"bla"');
    await this.code.expectValue('code');
  }

  async clear() {
    await this.paramSection.toggle();
    await this.params.clear();
    await this.paramSection.toggle();
    await this.mapping.row(0).column(1).clearExpression();
    await this.code.clear();
  }

  async assertClear() {
    await this.paramSection.toggle();
    await this.params.expectEmpty();
    await this.paramSection.toggle();
    await this.mapping.row(0).column(1).expectEmpty();
    await this.codeSection.expectIsClosed();
  }
}

export const ResultTest = new NewPartTest('Result', (part: Part) => new Result(part));
export const MethodResultTest = new NewPartTest('Result', (part: Part) => new Result(part, true));
