import { expect } from '@playwright/test';
import type { ScriptArea } from '../../page-objects/inscription/code-editor';
import type { Combobox } from '../../page-objects/inscription/combobox';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import type { Table } from '../../page-objects/inscription/table';
import { NewPartTest, PartObject } from './part-tester';

class Call extends PartObject {
  callSection: Section;
  call: Combobox;
  mappingSection: Section;
  mapping: Table;
  codeSection: Section;
  code: ScriptArea;

  constructor(
    part: Part,
    readonly selectLabel: string,
    private readonly selectValue: string,
    private readonly assertSelectValue: string
  ) {
    super(part);
    this.callSection = part.section(selectLabel);
    this.call = this.callSection.combobox();
    this.mappingSection = part.section('Mapping');
    this.mapping = this.mappingSection.table(['label', 'expression']);
    this.codeSection = part.section('Code');
    this.code = this.codeSection.scriptArea();
  }

  async fill() {
    await this.callSection.expectIsOpen();
    await this.call.choose(this.selectValue);
    await this.mappingSection.expectIsOpen();
    await expect(this.mapping.row(2).column(0).locator).toHaveText('country');
    await this.mapping.row(2).column(1).fill('"test"');
    await this.codeSection.open();
    await this.code.fill('code');
  }

  async assertFill() {
    await this.call.expectValue(this.assertSelectValue);
    await this.mapping.row(2).column(1).expectValue('"test"');
    await this.code.expectValue('code');
  }

  async clear() {
    await this.code.loaded();
    await this.mapping.row(2).column(1).clearExpression();
    await this.code.clear();
  }

  async assertClear() {
    await this.call.expectValue(this.assertSelectValue);
    await this.mappingSection.expectIsOpen();
    await this.codeSection.expectIsClosed();
  }
}

export const DialogCallTest = new NewPartTest(
  'Dialog',
  (part: Part) => new Call(part, 'Dialog', 'PersonEditor', 'com.acme.PersonEditor:start(ch.ivyteam.test.Person)')
);

export const SubCallTest = new NewPartTest(
  'Process',
  (part: Part) =>
    new Call(
      part,
      'Process start',
      'AllElementsInscribedSubProcess',
      'AllElements/Inscribed/AllElementsInscribedSubProcess:call(String,Integer,String,Double)'
    )
);

export const TriggerCallTest = new NewPartTest(
  'Process',
  (part: Part) =>
    new Call(
      part,
      'Process start',
      'AllElementsInscribedProcess',
      'AllElements/Inscribed/AllElementsInscribedProcess:start(String,String,Number,Number,String,Number,String)'
    )
);
