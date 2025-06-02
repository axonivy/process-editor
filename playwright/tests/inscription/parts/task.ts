import type { Accordion } from '../../page-objects/inscription/accordion';
import type { PartTest } from './part-tester';
import { NewPartTest, PartObject } from './part-tester';
import type { Part } from '../../page-objects/inscription/part';
import type { ScriptArea, ScriptInput } from '../../page-objects/inscription/code-editor';
import type { Section } from '../../page-objects/inscription/section';
import type { Select } from '../../page-objects/inscription/select';
import type { Table } from '../../page-objects/inscription/table';
import type { Checkbox } from '../../page-objects/inscription/checkbox';
import type { InfoComponent } from '../../page-objects/inscription/info-component';
import type { ResponsibleComponent } from '../../page-objects/inscription/responsible-component';

export class TasksTester implements PartTest {
  private tasks: { tab: string; test: PartTest }[];
  constructor(private readonly error: RegExp = /EventAndGateway/) {
    this.tasks = [
      { tab: 'TaskA', test: new TaskTester({ name: 'task1', error: this.error }) },
      { tab: 'TaskB', test: new TaskTester({ name: 'task2', error: this.error }) }
    ];
  }
  partName() {
    return 'Tasks';
  }
  async fill(part: Part) {
    for (const task of this.tasks) {
      const tab = (part as Accordion).tab(task.tab);
      await tab.switchTo();
      await task.test.fill(tab);
    }
  }
  async assertFill(part: Part) {
    for (const task of this.tasks) {
      const tab = (part as Accordion).tab(task.tab);
      tab.switchTo();
      await task.test.assertFill(tab);
    }
  }
  async clear(part: Part) {
    for (const task of this.tasks) {
      const tab = (part as Accordion).tab(task.tab);
      tab.switchTo();
      await task.test.clear(tab);
    }
  }
  async assertClear(part: Part) {
    for (const task of this.tasks) {
      const tab = (part as Accordion).tab(task.tab);
      tab.switchTo();
      await task.test.assertClear(tab);
    }
  }
}

type TaskTestOptions = { responsible: boolean; priority: boolean; expiry: boolean; options: 'persist' | 'list' | undefined };

class Task extends PartObject {
  info: InfoComponent;
  responsible: ResponsibleComponent;
  prioritySection: Section;
  priority: Select;
  optionsSection: Section;
  skipTasklist: Checkbox;
  notificationSection: Section;
  notificationSuppress: Checkbox;
  notificationTemplate: Select;
  delay: ScriptInput;
  persist: Checkbox;
  expirySection: Section;
  timeout: ScriptInput;
  error: Select;
  expiryResponsbile: ResponsibleComponent;
  expiryPriority: Select;
  customFieldsSection: Section;
  customFields: Table;
  codeSection: Section;
  code: ScriptArea;

  constructor(
    part: Part,
    private readonly nameValue = 'test name',
    private readonly errorValue = /f8/,
    private readonly options: TaskTestOptions = { responsible: true, priority: true, expiry: true, options: 'list' }
  ) {
    super(part);
    this.info = part.infoComponent();
    this.responsible = part.responsibleSection();
    this.prioritySection = part.section('Priority');
    this.priority = this.prioritySection.select({});
    this.optionsSection = part.section('Options');
    this.skipTasklist = this.optionsSection.checkbox('Skip Tasklist');
    this.notificationSection = part.section('Notification');
    this.notificationSuppress = this.notificationSection.checkbox('Suppress');
    this.notificationTemplate = this.notificationSection.select({ label: 'Template' });
    this.delay = this.optionsSection.scriptInput('Delay');
    this.persist = this.optionsSection.checkbox('Persist task on creation');
    this.expirySection = part.section('Expiry');
    this.timeout = this.expirySection.scriptInput('Timeout');
    this.error = this.expirySection.select({ label: 'Error' });
    this.expiryResponsbile = this.expirySection.responsibleComponent();
    this.expiryPriority = this.expirySection.select({ label: 'Priority' });
    this.customFieldsSection = part.section('Custom Fields');
    this.customFields = this.customFieldsSection.table(['combobox', 'label', 'expression']);
    this.codeSection = part.section('Code');
    this.code = this.codeSection.scriptArea();
  }

  async fill() {
    await this.info.fill(this.nameValue);

    if (this.options.responsible) {
      await this.responsible.fill('Role from Attribute', '"Teamleader"');
    }

    if (this.options.priority) {
      await this.prioritySection.open();
      await this.priority.choose('High');
    }

    if (this.options.options) {
      await this.optionsSection.toggle();
      if (this.options.options === 'persist') {
        await this.persist.click();
      } else {
        await this.skipTasklist.click();
        await this.delay.fill('delay');
      }
    }

    if (this.options.options === 'list') {
      await this.notificationSection.toggle();
      await this.notificationTemplate.choose('Customer');
      await this.notificationSuppress.click();
    }

    if (this.options.expiry) {
      await this.expirySection.toggle();
      await this.timeout.fill('timeout');
      await this.error.choose(this.errorValue);
      await this.expiryResponsbile.fill('Nobody & delete');
      await this.expiryPriority.choose('Low');
    }

    await this.customFieldsSection.toggle();
    const row = await this.customFields.addRow();
    await row.fill(['cf', '"value"']);

    await this.codeSection.toggle();
    await this.code.fill('code');
  }

  async assertFill() {
    await this.info.expectFill(this.nameValue);

    if (this.options.responsible) {
      await this.responsible.expectFill('Role from Attribute', '"Teamleader"');
    }

    if (this.options.priority) {
      await this.priority.expectValue(/High/);
    }

    if (this.options.options) {
      if (this.options.options === 'persist') {
        await this.persist.expectChecked();
        await this.persist.click();
      } else {
        await this.skipTasklist.expectChecked();
        await this.delay.expectValue('delay');
      }
    }

    if (this.options.options === 'list') {
      await this.notificationTemplate.expectValue('Customer');
      await this.notificationSuppress.expectChecked();
    }

    if (this.options.expiry) {
      await this.timeout.expectValue('timeout');
      await this.error.expectValue(this.errorValue);
      await this.expiryResponsbile.expectFill('Nobody & delete');
      await this.expiryPriority.expectValue(/Low/);
    }

    await this.customFields.expectRowCount(1);
    await this.customFields.cell(0, 0).expectValue('cf');
    await this.customFields.cell(0, 2).expectValue('"value"');

    await this.code.expectValue('code');
  }

  async clear() {
    await this.info.clear();

    if (this.options.responsible) {
      await this.responsible.clear();
    }

    if (this.options.priority) {
      await this.priority.choose('Normal');
    }

    if (this.options.options) {
      if (this.options.options === 'list') {
        await this.skipTasklist.click();
        await this.delay.clear();
      }
    }

    if (this.options.options === 'list') {
      await this.notificationSuppress.click();
      await this.notificationTemplate.choose('Default');
    }

    if (this.options.expiry) {
      await this.error.clear();
      await this.timeout.clear();
    }

    await this.customFields.clear();

    await this.code.clear();
  }

  async assertClear() {
    await this.info.expectEmpty();

    if (this.options.responsible) {
      await this.responsible.expectEmpty();
    }

    if (this.options.priority) {
      await this.prioritySection.expectIsClosed();
    }

    if (this.options.options) {
      await this.optionsSection.expectIsClosed();
    }

    if (this.options.options === 'list') {
      await this.notificationSection.expectIsClosed();
    }

    if (this.options.expiry) {
      await this.expirySection.expectIsClosed();
    }
    await this.customFieldsSection.expectIsClosed();
    await this.codeSection.expectIsClosed();
  }
}

export class TaskTester extends NewPartTest {
  constructor(options?: { name?: string; error?: RegExp; testOptions?: TaskTestOptions }) {
    super('Task', (part: Part) => new Task(part, options?.name, options?.error, options?.testOptions));
  }
}

export const WsStartTaskTest = new TaskTester({
  error: /EventAndGateway/,
  testOptions: { responsible: false, priority: true, expiry: false, options: undefined }
});
export const TasksTest = new TasksTester();
