import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import type { KnownEditor } from '../InscriptionEditor';
import { thirdPartyInterfaceActivityEditors } from './interface';
import { thirdPartyIntermediateEventEditors } from './intermediate';
import { thirdPartyStartEventEditors } from './start';

export const thirdPartyEditors = new Map<ElementType, KnownEditor>([
  ...thirdPartyInterfaceActivityEditors,
  ...thirdPartyStartEventEditors,
  ...thirdPartyIntermediateEventEditors
]);
