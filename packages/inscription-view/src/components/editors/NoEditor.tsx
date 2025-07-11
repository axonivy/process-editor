import { PanelMessage } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import AppStateView from '../../AppStateView';

const NoEditor = ({ type }: { type?: string }) => {
  const { t } = useTranslation();
  return (
    <AppStateView>
      {type ? (
        <PanelMessage icon={IvyIcons.Help} message={t('message.noEditorForType', { type })} />
      ) : (
        <PanelMessage icon={IvyIcons.DragDrop} message={t('message.selectElement')} />
      )}
    </AppStateView>
  );
};

export default memo(NoEditor);
