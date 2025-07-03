import { Button, Flex } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { GArgument, RedoAction, UndoAction, type GModelRoot, type IActionDispatcher } from '@eclipse-glsp/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const EditButtons = ({ root, dispatcher }: { root: Readonly<GModelRoot>; dispatcher: IActionDispatcher }) => {
  const { t } = useTranslation();
  return (
    <Flex gap={1} className='edit-buttons'>
      <Button
        id='btn_undo_tools'
        title={t('toolbar.undo')}
        icon={IvyIcons.Undo}
        size='large'
        onClick={() => dispatcher.dispatch(UndoAction.create())}
        disabled={GArgument.getArgument(root, 'canUndo') !== true}
      />
      <Button
        id='btn_redo_tools'
        title={t('toolbar.redo')}
        icon={IvyIcons.Redo}
        size='large'
        onClick={() => dispatcher.dispatch(RedoAction.create())}
        disabled={GArgument.getArgument(root, 'canRedo') !== true}
      />
    </Flex>
  );
};
