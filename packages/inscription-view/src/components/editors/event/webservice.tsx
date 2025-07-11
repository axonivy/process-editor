import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { memo } from 'react';
import { useCasePart } from '../../parts/case/CasePart';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useResultPart } from '../../parts/result/ResultPart';
import { useStartPart } from '../../parts/start/StartPart';
import { useTaskPart } from '../../parts/task/TaskPart';
import { useWebServicePart } from '../../parts/web-service/WebServicePart';
import { type KnownEditor } from '../InscriptionEditor';
import NameEditor from '../NameEditor';
import Part from '../part/Part';

const WebserviceStartEditor = memo(() => {
  const name = useGeneralPart();
  const start = useStartPart({ synchParams: true });
  const result = useResultPart();
  const webService = useWebServicePart();
  const task = useTaskPart({ type: 'ws' });
  const casePart = useCasePart();
  return <Part parts={[name, start, result, webService, task, casePart]} />;
});

export const webServiceEventEditors = new Map<ElementType, KnownEditor>([
  ['WebserviceStart', { editor: <WebserviceStartEditor />, icon: IvyIcons.WebService }],
  ['WebserviceEnd', { editor: <NameEditor />, icon: IvyIcons.WebService }]
]);
