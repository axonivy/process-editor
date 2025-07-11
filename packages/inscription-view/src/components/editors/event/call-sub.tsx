import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { memo } from 'react';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useResultPart } from '../../parts/result/ResultPart';
import { useStartPart } from '../../parts/start/StartPart';
import { type KnownEditor } from '../InscriptionEditor';
import NameEditor from '../NameEditor';
import Part from '../part/Part';

const CallSubStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useStartPart({ synchParams: true });
  const result = useResultPart();
  return <Part parts={[name, start, result]} />;
});

export const callSubEventEditors = new Map<ElementType, KnownEditor>([
  ['CallSubStart', { editor: <CallSubStartEditor />, icon: IvyIcons.SubStart }],
  ['CallSubEnd', { editor: <NameEditor />, icon: IvyIcons.SubEnd }]
]);
