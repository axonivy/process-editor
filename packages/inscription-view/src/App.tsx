import type {
  ElementData,
  InscriptionData,
  InscriptionElementContext,
  PID,
  ValidationResult
} from '@axonivy/process-editor-inscription-protocol';
import { PanelMessage, ReadonlyProvider, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './App.css';
import AppStateView from './AppStateView';
import { InscriptionEditor, type InscriptionOutlineProps } from './components/editors/InscriptionEditor';
import { useClient } from './context/useClient';
import { DataContextInstance } from './context/useDataContext';
import { DEFAULT_EDITOR_CONTEXT, EditorContextInstance } from './context/useEditorContext';
import type { Unary } from './types/lambda';

function App({ outline, ...context }: InscriptionElementContext & InscriptionOutlineProps) {
  const { t } = useTranslation();
  const [initData, setInitData] = useState<{ pid: string; data: ElementData } | undefined>();
  const [showOutline, setShowOutline] = useState(false);

  const client = useClient();
  const queryClient = useQueryClient();
  const editorRef = useRef(null);

  const queryKeys = useMemo(() => {
    return {
      data: (context: InscriptionElementContext) => ['data', context],
      saveData: (context: InscriptionElementContext) => ['saveData', context],
      validation: (context: InscriptionElementContext) => ['validations', context]
    };
  }, []);

  useEffect(() => {
    const validationDispose = client.onValidation(() => queryClient.invalidateQueries({ queryKey: queryKeys.validation(context) }));
    const dataDispose = client.onDataChanged(() => queryClient.invalidateQueries({ queryKey: queryKeys.data(context) }));
    return () => {
      validationDispose.dispose();
      dataDispose.dispose();
    };
  }, [client, context, queryClient, queryKeys]);

  const { data, isSuccess, isPending, isError, error } = useQuery({
    queryKey: queryKeys.data(context),
    queryFn: () => client.data(context),
    structuralSharing: false
  });

  const { data: validations } = useQuery({
    queryKey: queryKeys.validation(context),
    queryFn: () => client.validate(context),
    initialData: [],
    enabled: isSuccess
  });

  const mutation = useMutation({
    mutationKey: queryKeys.saveData(context),
    mutationFn: (updateData: Unary<ElementData>) => {
      const saveData = queryClient.setQueryData<InscriptionData>(queryKeys.data(context), prevData => {
        if (prevData) {
          return { ...prevData, data: updateData(prevData.data) };
        }
        return undefined;
      });
      if (saveData) {
        return client.saveData(saveData);
      }
      return Promise.resolve([]);
    },
    onSuccess: (data: ValidationResult[]) => queryClient.setQueryData(queryKeys.validation(context), data)
  });

  if (isPending || data?.context.pid !== context.pid) {
    return (
      <AppStateView>
        <Spinner size='large' />
      </AppStateView>
    );
  }

  if (isError) {
    return (
      <AppStateView>
        <PanelMessage icon={IvyIcons.ErrorXMark} message={t('message.globalError', { error })} />
      </AppStateView>
    );
  }

  if (initData === undefined || initData?.pid !== context.pid) {
    setInitData({ pid: context.pid, data: data.data });
  }

  return (
    <div ref={editorRef} className='editor-root' data-mutation-state={mutation.status}>
      <ReadonlyProvider readonly={data.readonly ?? false}>
        <EditorContextInstance.Provider
          value={{
            context: { app: context.app, pmv: context.pmv },
            elementContext: context,
            editorRef,
            type: data.type ?? DEFAULT_EDITOR_CONTEXT.type,
            navigateTo: (pid: PID) => outline?.onClick?.(pid)
          }}
        >
          <DataContextInstance.Provider
            value={{
              data: data.data,
              setData: mutation.mutate,
              defaultData: data.defaults,
              initData: initData?.data ?? data.data,
              validations
            }}
          >
            <InscriptionEditor outline={outline} showOutline={showOutline} setShowOutline={setShowOutline} />
          </DataContextInstance.Provider>
        </EditorContextInstance.Provider>
      </ReadonlyProvider>
    </div>
  );
}

export default App;
