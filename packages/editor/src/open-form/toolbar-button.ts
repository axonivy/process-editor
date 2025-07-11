import { OpenFormEditorAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { EditorContextService, GArgument, hasArgs } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { inject, injectable } from 'inversify';
import { ToolBarButtonLocation, type ToolBarButtonProvider } from '../ui-tools/tool-bar/button';

@injectable()
export class OpenFormEditorButtonProvider implements ToolBarButtonProvider {
  @inject(EditorContextService) protected readonly editorContext: EditorContextService;

  button() {
    try {
      if (hasArgs(this.editorContext.modelRoot) && GArgument.getString(this.editorContext.modelRoot, 'kind') === 'html-dialog') {
        return {
          icon: IvyIcons.File,
          title: t('toolbar.openFormEditor', { hotkey: 'F' }),
          id: 'btn_open_form_editor',
          sorting: 'F',
          action: () => OpenFormEditorAction.create(),
          location: ToolBarButtonLocation.Right,
          readonly: true
        };
      }
    } catch (e) {
      console.log(`Couldn't load model root`, e);
    }
    return undefined;
  }
}
