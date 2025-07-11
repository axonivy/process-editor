import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { memo } from 'react';
import { useEndPagePart } from '../../parts/end-page/EndPagePart';
import { useErrorThrowPart } from '../../parts/error/ErrorThrowPart';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { type KnownEditor } from '../InscriptionEditor';
import NameEditor from '../NameEditor';
import Part from '../part/Part';

const TaskEndPageEditor = memo(() => {
  const name = useGeneralPart();
  const endPage = useEndPagePart();
  return <Part parts={[name, endPage]} />;
});

const ErrorEndEditor = memo(() => {
  const name = useGeneralPart();
  const error = useErrorThrowPart();
  return <Part parts={[name, error]} />;
});

export const endEventEditors = new Map<ElementType, KnownEditor>([
  ['TaskEnd', { editor: <NameEditor />, icon: IvyIcons.ProcessEnd }],
  ['TaskEndPage', { editor: <TaskEndPageEditor />, icon: IvyIcons.EndPage }],
  ['ErrorEnd', { editor: <ErrorEndEditor />, icon: IvyIcons.ErrorEnd }]
]);
