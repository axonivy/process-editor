import type { Part } from '../../page-objects/inscription/part';
import { NewPartTest, PartObject } from './part-tester';
import type { Section } from '../../page-objects/inscription/section';
import type { Select } from '../../page-objects/inscription/select';
import type { Table } from '../../page-objects/inscription/table';
import type { ScriptInput } from '../../page-objects/inscription/code-editor';
import type { Combobox } from '../../page-objects/inscription/combobox';
import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

class RestRequest extends PartObject {
  openapiSwitch: Locator;
  serviceSection: Section;
  targetUrl: Locator;
  client: Select;
  resource: Combobox;
  method: Select;
  path: ScriptInput;
  parametersSection: Section;
  parameters: Table;
  headersSection: Section;
  acceptHeader: Combobox;
  headers: Table;
  propertiesSection: Section;
  properties: Table;

  constructor(part: Part) {
    super(part);
    this.openapiSwitch = part.currentLocator().getByRole('switch', { name: 'OpenAPI' });
    this.serviceSection = part.section('Rest Service');
    this.targetUrl = this.serviceSection.currentLocator().locator('.rest-target-url');
    this.client = this.serviceSection.select({ label: 'Client' });
    this.resource = this.serviceSection.combobox('Resource');
    this.method = this.serviceSection.select({ nth: 1 });
    this.path = this.serviceSection.scriptInput();
    this.parametersSection = part.section('Parameters');
    this.parameters = this.parametersSection.table(['select', 'text', 'expression']);
    this.headersSection = part.section('Headers');
    this.acceptHeader = this.headersSection.combobox('Accept');
    this.headers = this.headersSection.table(['combobox', 'expression']);
    this.propertiesSection = part.section('Properties');
    this.properties = this.propertiesSection.table(['combobox', 'expression']);
  }

  async fill() {
    await this.serviceSection.expectIsOpen();
    await expect(this.targetUrl).toBeHidden();
    await this.client.choose('stock');
    await this.method.choose('POST');
    await this.path.fill('/{myParam}');

    await this.parameters.expectRowCount(4);
    await this.parameters.row(3).column(2).fill('123');
    const paramRow = await this.parameters.addRow();
    await paramRow.fill(['Query', 'query', 'bla']);

    await this.headersSection.toggle();
    await this.acceptHeader.choose('application/json');
    const headerRow = await this.headers.addRow();
    await headerRow.fill(['Allow', 'abc']);

    await this.propertiesSection.toggle();
    const propRow = await this.properties.addRow();
    await propRow.fill(['username', 'hans']);
  }

  async assertFill() {
    await expect(this.targetUrl).toHaveText(
      'http://acme.stock/api/{request.kind}/{product.number}:{product.quantity}/update/{myParam}?query=bla'
    );
    await this.client.expectValue('stock');
    await this.method.expectValue('POST');
    await this.path.expectValue('/{myParam}');

    await this.parametersSection.expectIsOpen();
    await this.parameters.row(3).column(2).expectValue('123');
    await this.parameters.row(4).expectValues(['Query', 'query', 'bla']);

    await this.headersSection.expectIsOpen();
    await this.acceptHeader.expectValue('application/json');
    await this.headers.row(0).expectValues(['Allow', 'abc']);

    await this.propertiesSection.expectIsOpen();
    await this.properties.row(0).expectValues(['username', 'hans']);
  }

  async clear() {
    await this.method.choose('GET');
    await this.path.clear();

    await this.parameters.row(4).remove();
    await this.parameters.row(3).remove();

    await this.acceptHeader.fill('*/*');
    await this.headers.clear();

    await this.properties.clear();
  }

  async assertClear() {
    await expect(this.targetUrl).toHaveText('http://acme.stock/api/{request.kind}/{product.number}:{product.quantity}/update');
    await this.method.expectValue('GET');
    await this.path.expectEmpty();

    await this.parametersSection.expectIsOpen();
    await this.parameters.expectRowCount(3);

    await this.headersSection.expectIsClosed();

    await this.propertiesSection.expectIsClosed();
  }
}

class RestRequestOpenApi extends RestRequest {
  override async fill() {
    await this.serviceSection.expectIsOpen();
    await this.client.choose('pet');
    await expect(this.openapiSwitch).toBeVisible();
    await this.resource.choose('DELETE');

    await this.parameters.expectRowCount(1);
    await this.parameters.row(0).column(2).fill('123');

    await this.headersSection.toggle();
    const headerRow = await this.headers.addRow();
    await headerRow.fill(['api_key', 'abc']);
  }

  override async assertFill() {
    await this.client.expectValue('pet');
    await this.resource.expectValue('DELETE:/pet/{petId}');

    await this.parameters.row(0).expectValues(['Path', 'petId', '123']);

    await this.headers.row(0).expectValues(['api_key', 'abc']);
  }

  override async clear() {
    await this.openapiSwitch.click();
    await this.path.fill('/pet');

    await this.parameters.clear();
  }

  override async assertClear() {
    await this.client.expectValue('pet');
    await this.resource.expectValue('DELETE:/pet');

    await this.parametersSection.expectIsClosed();
  }
}

export const RestRequestTest = new NewPartTest('Request', (part: Part) => new RestRequest(part));
export const RestRequestOpenApiTest = new NewPartTest('Request', (part: Part) => new RestRequestOpenApi(part));
