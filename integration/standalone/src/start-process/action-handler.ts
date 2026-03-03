import { StartProcessAction } from '@axonivy/process-editor-protocol';
import { Action, type IActionHandler } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class StartProcessActionHandler implements IActionHandler {
  handle(action: Action): void {
    if (StartProcessAction.is(action)) {
      window.open(action.processStartUri, '_blank');
    }
  }
}
