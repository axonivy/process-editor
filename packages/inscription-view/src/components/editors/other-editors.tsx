import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { memo } from 'react';
import { useGeneralPart } from '../parts/name/GeneralPart';
import { usePermissionsPart } from '../parts/permissions/PermissionsPart';
import { useProcessDataPart } from '../parts/process-data/ProcessDataPart';
import { useWebServiceProcessPart } from '../parts/web-service-process/WebServiceProcessPart';
import { type KnownEditor } from './InscriptionEditor';
import NameEditor from './NameEditor';
import Part from './part/Part';

const BusinessProcessEditor = memo(() => {
  const name = useGeneralPart({ disableName: true, hideTags: true });
  const processData = useProcessDataPart();
  const permissions = usePermissionsPart();
  return <Part parts={[name, processData, permissions]} />;
});

const WebserviceProcessEditor = memo(() => {
  const name = useGeneralPart({ disableName: true, hideTags: true });
  const webServiceProcess = useWebServiceProcessPart();
  const processData = useProcessDataPart();
  const permissions = usePermissionsPart();
  return <Part parts={[name, webServiceProcess, processData, permissions]} />;
});

const CallableSubProcessEditor = memo(() => {
  const name = useGeneralPart({ disableName: true, hideTags: true });
  const processData = useProcessDataPart();
  const permissions = usePermissionsPart();
  return <Part parts={[name, processData, permissions]} />;
});

const HTMLDialogLogicEditor = memo(() => {
  const name = useGeneralPart({ disableName: true, hideTags: true });
  const permissions = usePermissionsPart();
  return <Part parts={[name, permissions]} />;
});

export const otherEditors = new Map<ElementType, KnownEditor>([
  ['ProcessAnnotation', { editor: <NameEditor hideTags={true} />, icon: IvyIcons.Note }],
  ['Process', { editor: <BusinessProcessEditor />, icon: IvyIcons.Process }],
  ['WebserviceProcess', { editor: <WebserviceProcessEditor />, icon: IvyIcons.Process }],
  ['CallableSubProcess', { editor: <CallableSubProcessEditor />, icon: IvyIcons.Process }],
  ['HtmlDialogProcess', { editor: <HTMLDialogLogicEditor />, icon: IvyIcons.Process }]
]);
