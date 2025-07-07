import { Composite } from './composite';
import { InfoComponent } from './info-component';
import { ResponsibleComponent, ResponsibleSection } from './responsible-component';
import { Section } from './section';

export abstract class Part extends Composite {
  section(label: string) {
    return new Section(this.page, this.locator, label);
  }

  infoComponent() {
    return new InfoComponent(this);
  }

  responsibleComponent() {
    return new ResponsibleComponent(this);
  }

  responsibleSection(defaultOpen: boolean = false) {
    return new ResponsibleSection(this, defaultOpen);
  }
}
