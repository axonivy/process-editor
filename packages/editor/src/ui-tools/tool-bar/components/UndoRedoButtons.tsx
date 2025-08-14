import { Button, Flex, Separator, ToolbarContainer } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { GArgument, GModelRoot, type IActionDispatcher, RedoAction, UndoAction } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';

interface UndoRedoButtonsProps {
  actionDispatcher: IActionDispatcher;
  modelRoot: GModelRoot;
}

export const UndoRedoButtons: React.FC<UndoRedoButtonsProps> = ({ actionDispatcher, modelRoot }) => {
  const canUndo = GArgument.getArgument(modelRoot, 'canUndo') === true;
  const canRedo = GArgument.getArgument(modelRoot, 'canRedo') === true;

  return (
    <ToolbarContainer maxWidth={450}>
      <Flex>
        <Separator orientation='vertical' style={{ height: '26px' }} />
        <Flex gap={1} className='edit-buttons'>
          <Button
            id='btn_undo_tools'
            title={t('toolbar.undo')}
            aria-label={t('toolbar.undo')}
            icon={IvyIcons.Undo}
            size='large'
            onClick={() => actionDispatcher.dispatch(UndoAction.create())}
            disabled={!canUndo}
          />
          <Button
            id='btn_redo_tools'
            title={t('toolbar.redo')}
            aria-label={t('toolbar.redo')}
            icon={IvyIcons.Redo}
            size='large'
            onClick={() => actionDispatcher.dispatch(RedoAction.create())}
            disabled={!canRedo}
          />
        </Flex>
      </Flex>
    </ToolbarContainer>
  );
};
