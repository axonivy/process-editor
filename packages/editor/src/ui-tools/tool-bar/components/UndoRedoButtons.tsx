import { Button, Flex, hotkeyText, isWindows, Separator, ToolbarContainer } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { GArgument, GModelRoot, type IActionDispatcher, RedoAction, UndoAction } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';

interface UndoRedoButtonsProps {
  actionDispatcher: IActionDispatcher;
  modelRoot: GModelRoot;
}

export const UndoRedoButtons = ({ actionDispatcher, modelRoot }: UndoRedoButtonsProps) => {
  const canUndo = GArgument.getArgument(modelRoot, 'canUndo') === true;
  const canRedo = GArgument.getArgument(modelRoot, 'canRedo') === true;
  const undoLabel = t('common.hotkey.undo', { hotkey: hotkeyText('mod+Z') });
  const redoLabel = t('common.hotkey.redo', { hotkey: hotkeyText(isWindows() ? 'mod+Y' : 'mod+shift+Z') });

  return (
    <ToolbarContainer maxWidth={450}>
      <Flex>
        <Separator orientation='vertical' style={{ height: '26px' }} />
        <Flex gap={1} className='edit-buttons'>
          <Button
            id='btn_undo_tools'
            title={undoLabel}
            aria-label={undoLabel}
            icon={IvyIcons.Undo}
            size='large'
            onClick={() => actionDispatcher.dispatch(UndoAction.create())}
            disabled={!canUndo}
          />
          <Button
            id='btn_redo_tools'
            title={redoLabel}
            aria-label={redoLabel}
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
