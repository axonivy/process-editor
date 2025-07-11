import type { Part } from '../../page-objects/inscription/part';
import type { Section } from '../../page-objects/inscription/section';
import type { Select } from '../../page-objects/inscription/select';
import type { Table } from '../../page-objects/inscription/table';
import { NewPartTest, PartObject } from './part-tester';

class WsRequest extends PartObject {
  serviceSection: Section;
  client: Select;
  port: Select;
  operation: Select;
  propertiesSection: Section;
  properties: Table;
  mappingSection: Section;
  mapping: Table;

  constructor(part: Part) {
    super(part);
    this.serviceSection = part.section('Web Service');
    this.client = this.serviceSection.select({ label: 'Client' });
    this.port = this.serviceSection.select({ label: 'Port' });
    this.operation = this.serviceSection.select({ label: 'Operation' });
    this.propertiesSection = part.section('Properties');
    this.properties = this.propertiesSection.table(['combobox', 'expression']);
    this.mappingSection = part.section('Mapping');
    this.mapping = this.mappingSection.table(['label', 'expression']);
  }

  async fill() {
    await this.serviceSection.expectIsOpen();
    await this.client.choose('GeoIpService');
    await this.port.choose('GeoIPServiceSoap');
    await this.operation.choose('GetGeoIP');

    await this.propertiesSection.toggle();
    const row = await this.properties.addRow();
    await row.fill(['endpoint.cache', '123']);
    await this.propertiesSection.toggle();

    await this.mappingSection.open();
    await this.mapping.row(1).column(1).fill('"bla"');
  }

  async assertFill() {
    await this.client.expectValue('GeoIpService');
    await this.port.expectValue('GeoIPServiceSoap');
    await this.operation.expectValue('GetGeoIP');

    await this.propertiesSection.expectIsOpen();
    await this.properties.row(0).expectValues(['endpoint.cache', '123']);
    await this.propertiesSection.toggle();

    await this.mapping.expectRowCount(2);
    await this.mapping.row(1).column(1).expectValue('"bla"');
  }

  async clear() {
    await this.port.choose('GeoIPServiceSoap12');
    await this.operation.choose('GetGeoIPContext');

    await this.properties.clear();

    await this.mapping.row(1).column(1).clearExpression();
  }

  async assertClear() {
    await this.client.expectValue('GeoIpService');
    await this.port.expectValue('GeoIPServiceSoap12');
    await this.operation.expectValue('GetGeoIPContext');

    await this.propertiesSection.expectIsClosed();
    await this.mappingSection.expectIsClosed();
  }
}

export const WsRequestTest = new NewPartTest('Request', (part: Part) => new WsRequest(part));
