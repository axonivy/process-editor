import type { MailData } from '@axonivy/process-editor-inscription-protocol';
import { produce } from 'immer';
import { useConfigDataContext, type ConfigDataContext } from '../../../context/useDataContext';
import type { DataUpdater } from '../../../types/lambda';

export function useMailData(): ConfigDataContext<MailData> & {
  update: DataUpdater<MailData>;
  updateHeader: DataUpdater<MailData['headers']>;
  updateMessage: DataUpdater<MailData['message']>;
} {
  const { setConfig, ...config } = useConfigDataContext();

  const update: DataUpdater<MailData> = (field, value) =>
    setConfig(
      produce((draft: MailData) => {
        draft[field] = value;
      })
    );

  const updateHeader: DataUpdater<MailData['headers']> = (field, value) =>
    setConfig(
      produce(draft => {
        draft.headers[field] = value;
      })
    );

  const updateMessage: DataUpdater<MailData['message']> = (field, value) =>
    setConfig(
      produce(draft => {
        draft.message[field] = value;
      })
    );

  return {
    ...config,
    update,
    updateHeader,
    updateMessage
  };
}
