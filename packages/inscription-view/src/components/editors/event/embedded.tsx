import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import type { KnownEditor } from '../InscriptionEditor';
import NameEditor from '../NameEditor';

export const embeddedEventEditors = new Map<ElementType, KnownEditor>([
  ['EmbeddedStart', { editor: <NameEditor />, icon: IvyIcons.Start }],
  ['EmbeddedEnd', { editor: <NameEditor />, icon: IvyIcons.ProcessEnd }]
]);
