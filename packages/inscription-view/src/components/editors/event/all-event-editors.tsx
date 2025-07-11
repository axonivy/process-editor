import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import type { KnownEditor } from '../InscriptionEditor';
import { boundaryEventEditors } from './boundary';
import { callSubEventEditors } from './call-sub';
import { embeddedEventEditors } from './embedded';
import { endEventEditors } from './end';
import { htmlDialogEventEditors } from './html-dialog';
import { intermediateEventEditors } from './intermediate';
import { startEventEditors } from './start';
import { webServiceEventEditors } from './webservice';

export const eventEditors = new Map<ElementType, KnownEditor>([
  ...startEventEditors,
  ...intermediateEventEditors,
  ...endEventEditors,
  ...boundaryEventEditors,
  ...webServiceEventEditors,
  ...callSubEventEditors,
  ...embeddedEventEditors,
  ...htmlDialogEventEditors
]);
