import type { ElementType } from '@axonivy/process-editor-inscription-protocol';
import { IvyIcons } from '@axonivy/ui-icons';
import { memo } from 'react';
import { OpenApiContextProvider } from '../../../context/useOpenApi';
import { useCachePart } from '../../parts/cache/CachePart';
import { useMailAttachmentPart } from '../../parts/mail/MailAttachmentPart';
import { useMailErrorPart } from '../../parts/mail/MailErrorPart';
import { useMailHeaderPart } from '../../parts/mail/MailHeaderPart';
import { useMailMessagePart } from '../../parts/mail/MailMessagePart';
import { useGeneralPart } from '../../parts/name/GeneralPart';
import { useOutputPart } from '../../parts/output/OutputPart';
import { useProgramInterfaceErrorPart } from '../../parts/program/activity/ProgramInterfaceErrorPart';
import { useProgramInterfaceStartPart } from '../../parts/program/activity/ProgramInterfaceStartPart';
import { useConfigurationPart } from '../../parts/program/configuration/ConfigurationPart';
import { useDbErrorPart } from '../../parts/query/db-error/DbErrorPart';
import { useQueryPart } from '../../parts/query/QueryPart';
import { useRestErrorPart } from '../../parts/rest/RestErrorPart';
import { useRestOutputPart } from '../../parts/rest/RestOutputPart';
import { useRestRequestPart } from '../../parts/rest/RestRequestPart';
import { useWsErrorPart } from '../../parts/ws-error/WsErrorPart';
import { useWsRequestPart } from '../../parts/ws-request/WsRequestPart';
import { type KnownEditor } from '../InscriptionEditor';
import Part from '../part/Part';

const DatabaseEditor = memo(() => {
  const name = useGeneralPart();
  const query = useQueryPart();
  const cache = useCachePart();
  const error = useDbErrorPart();
  const output = useOutputPart({ additionalBrowsers: ['tablecol'] });
  return <Part parts={[name, query, cache, error, output]} />;
});

const WebServiceEditor = memo(() => {
  const name = useGeneralPart();
  const request = useWsRequestPart();
  const cache = useCachePart();
  const error = useWsErrorPart();
  const output = useOutputPart();
  return <Part parts={[name, request, cache, error, output]} />;
});

const RestEditor = memo(() => {
  const name = useGeneralPart();
  const request = useRestRequestPart();
  const error = useRestErrorPart();
  const output = useRestOutputPart();
  return (
    <OpenApiContextProvider>
      <Part parts={[name, request, error, output]} />
    </OpenApiContextProvider>
  );
});

const EMailEditor = memo(() => {
  const name = useGeneralPart();
  const header = useMailHeaderPart();
  const content = useMailMessagePart();
  const attachment = useMailAttachmentPart();
  const error = useMailErrorPart();
  return <Part parts={[name, header, content, attachment, error]} />;
});

const ProgramInterfaceEditor = memo(() => {
  const name = useGeneralPart();
  const start = useProgramInterfaceStartPart();
  const error = useProgramInterfaceErrorPart();
  const configuration = useConfigurationPart();
  return <Part parts={[name, start, error, configuration]} />;
});

export const interfaceActivityEditors = new Map<ElementType, KnownEditor>([
  ['Database', { editor: <DatabaseEditor />, icon: IvyIcons.Database }],
  ['WebServiceCall', { editor: <WebServiceEditor />, icon: IvyIcons.WebService }],
  ['RestClientCall', { editor: <RestEditor />, icon: IvyIcons.RestClient }],
  ['EMail', { editor: <EMailEditor />, icon: IvyIcons.EMail }],
  ['ProgramInterface', { editor: <ProgramInterfaceEditor />, icon: IvyIcons.ProgramOutline }]
]);
