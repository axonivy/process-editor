import type { Checkbox } from '../../page-objects/inscription/checkbox';
import type { ScriptArea } from '../../page-objects/inscription/code-editor';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import type { Table } from '../../page-objects/inscription/table';
import { NewPartTest, PartObject } from './part-tester';

class Output extends PartObject {
  mappingSection: Section;
  mapping: Table;

  constructor(part: Part) {
    super(part);
    this.mappingSection = part.section('Mapping');
    this.mapping = this.mappingSection.table(['text', 'expression']);
  }

  async fill() {
    await this.mappingSection.open();
    await this.mapping.row(1).column(1).fill('"bla"');
  }

  async assertFill() {
    await this.mapping.row(1).column(1).expectValue('"bla"');
  }

  async clear() {
    await this.mapping.row(1).column(1).clearExpression();
  }

  async assertClear() {
    await this.mapping.row(1).column(1).expectEmpty();
  }
}

class OutputCode extends Output {
  codeSection: Section;
  code: ScriptArea;
  sudo: Checkbox;

  constructor(
    part: Part,
    private readonly hasSudo = false
  ) {
    super(part);
    this.codeSection = part.section('Code');
    this.code = this.codeSection.scriptArea();
    this.sudo = this.codeSection.checkbox('Disable Permission Checks');
  }

  override async fill() {
    await super.fill();
    await this.codeSection.open();
    await this.code.fill('code');
    if (this.hasSudo) {
      await this.sudo.click();
    }
  }

  override async assertFill() {
    await super.assertFill();
    await this.code.expectValue('code');
    if (this.hasSudo) {
      await this.sudo.expectChecked();
    }
  }

  override async clear() {
    await super.clear();
    await this.code.clear();
    if (this.hasSudo) {
      await this.sudo.click();
    }
  }

  override async assertClear() {
    await super.assertClear();
    await this.codeSection.expectIsClosed();
  }
}

class OutputEmptyMap extends OutputCode {
  override async assertClear() {
    await this.mappingSection.expectIsOpen();
    await this.codeSection.expectIsClosed();
  }
}

class OutputScriptPart extends OutputCode {
  override async assertClear() {
    await this.mappingSection.expectIsClosed();
    await this.codeSection.expectIsOpen();
  }
}

export const OutputTest = new NewPartTest('Output', (part: Part) => new OutputCode(part));
export const ScriptOutputTest = new NewPartTest('Output', (part: Part) => new OutputScriptPart(part, true));
export const SignalOutputTest = new NewPartTest('Output', (part: Part) => new OutputEmptyMap(part));
