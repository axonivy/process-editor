import type { Checkbox } from '../../page-objects/inscription/checkbox';
import type { MacroEditor } from '../../page-objects/inscription/code-editor';
import type { Combobox } from '../../page-objects/inscription/combobox';
import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import { NewPartTest, PartObject } from './part-tester';

class SignalCatch extends PartObject {
  section: Section;
  signal: Combobox;
  signalMacro: MacroEditor;
  attach: Checkbox;

  constructor(
    part: Part,
    private readonly makroSupport: boolean = false
  ) {
    super(part);
    this.section = part.section('Signal Code');
    this.signal = this.section.combobox();
    this.signalMacro = this.section.macroInput();
    this.attach = this.section.checkbox('Attach to Business Case that signaled this process');
  }

  async fill() {
    await this.section.expectIsOpen();
    if (!this.makroSupport) {
      await this.signal.fill('test:signal');
      await this.attach.click();
    } else {
      await this.signalMacro.fill('test:signal');
    }
  }

  async assertFill() {
    if (!this.makroSupport) {
      await this.signal.expectValue('test:signal');
      await this.attach.expectUnchecked();
    } else {
      await this.signalMacro.expectValue('test:signal');
    }
  }

  async clear() {
    if (!this.makroSupport) {
      await this.signal.choose('');
      await this.attach.click();
    } else {
      await this.signalMacro.clear();
    }
  }

  async assertClear() {
    await this.section.expectIsOpen();
  }
}

export const SignalCatchTest = new NewPartTest('Signal', (part: Part) => new SignalCatch(part));
export const BoundarySignalCatchTest = new NewPartTest('Signal', (part: Part) => new SignalCatch(part, true));
