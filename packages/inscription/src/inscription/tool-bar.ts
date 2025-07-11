import { ToolBarButtonLocation, type ToolBarButtonProvider } from '@axonivy/process-editor';
import { IvyIcons } from '@axonivy/ui-icons';
import { t } from 'i18next';
import { injectable } from 'inversify';
import { ToggleInscriptionAction } from './action';

@injectable()
export class InscriptionButtonProvider implements ToolBarButtonProvider {
  button() {
    return {
      icon: IvyIcons.LayoutSidebarRightCollapse,
      title: t('toolbar.details'),
      sorting: 'Z',
      action: () => ToggleInscriptionAction.create({}),
      id: 'btn_inscription_toggle',
      location: ToolBarButtonLocation.Right,
      readonly: true
    };
  }
}
