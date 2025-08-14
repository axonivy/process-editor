import { CustomIconToggleAction, SwitchThemeAction } from '@axonivy/process-editor-protocol';
import { Field, Flex, IvyIcon, Label, Switch } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type IActionDispatcher, ShowGridAction } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';
import { ShowToolBarOptionsMenuAction } from '../options/action';

interface ToolBarOptionsMenuProps {
  action: ShowToolBarOptionsMenuAction;
  actionDispatcher: IActionDispatcher;
}

export const ToolBarOptionsMenu: React.FC<ToolBarOptionsMenuProps> = ({ action, actionDispatcher }) => {
  return (
    <div className='tool-bar-options-menu'>
      <div className='tool-bar-options-header'>
        <IvyIcon icon={IvyIcons.Settings} />
        <label>{t('common.label.settings')}</label>
      </div>
      <div className='tool-bar-options'>
        <Flex direction='column' gap={3}>
          {action.theme && (
            <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
              <Label>
                <Flex alignItems='center' gap={1}>
                  <IvyIcon icon={IvyIcons.DarkMode} />
                  {t('common.label.theme')}
                </Flex>
              </Label>
              <Switch
                defaultChecked={action.theme() === 'dark'}
                onCheckedChange={(checked: boolean) => {
                  actionDispatcher.dispatch(SwitchThemeAction.create({ theme: checked ? 'dark' : 'light' }));
                }}
                size='small'
              />
            </Field>
          )}
          <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
            <Label>
              <Flex alignItems='center' gap={1}>
                <IvyIcon icon={IvyIcons.GridDots} />
                {t('toolbar.grid')}
              </Flex>
            </Label>
            <Switch
              defaultChecked={action.grid()}
              onCheckedChange={(checked: boolean) => {
                actionDispatcher.dispatch(ShowGridAction.create({ show: checked }));
              }}
              size='small'
            />
          </Field>
          <Field direction='row' alignItems='center' justifyContent='space-between' gap={4}>
            <Label>
              <Flex alignItems='center' gap={1}>
                <IvyIcon icon={IvyIcons.CustomImage} />
                {t('toolbar.customIcon')}
              </Flex>
            </Label>
            <Switch
              defaultChecked={action.customIconState()}
              onCheckedChange={(checked: boolean) => {
                actionDispatcher.dispatch(CustomIconToggleAction.create({ showCustomIcons: checked }));
              }}
              size='small'
            />
          </Field>
        </Flex>
      </div>
    </div>
  );
};
