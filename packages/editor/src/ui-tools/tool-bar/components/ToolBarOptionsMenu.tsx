import { CustomIconToggleAction, SwitchThemeAction } from '@axonivy/process-editor-protocol';
import { Field, Flex, IvyIcon, Label, PopoverArrow, PopoverContent, Switch } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { type IActionDispatcher, ShowGridAction } from '@eclipse-glsp/client';
import { t } from 'i18next';
import React from 'react';
import { ShowToolBarOptionsMenuAction } from '../options/action';
import './ToolBarOptionsMenu.css';

interface ToolBarOptionsMenuProps {
  action: ShowToolBarOptionsMenuAction;
  actionDispatcher: IActionDispatcher;
}

export const ToolBarOptions = ({ closeMenu, ...props }: { closeMenu: () => void } & ToolBarOptionsMenuProps) => (
  <PopoverContent className={'tool-bar-options-content'} sideOffset={12} collisionPadding={4} onEscapeKeyDown={closeMenu}>
    <PopoverArrow />
    <ToolBarOptionsMenu {...props} />
  </PopoverContent>
);

const ToolBarOptionsMenu = ({ action, actionDispatcher }: ToolBarOptionsMenuProps) => (
  <Flex direction='column' className='tool-bar-options-menu'>
    <Flex alignItems='center' gap={1} className='tool-bar-options-header'>
      <IvyIcon icon={IvyIcons.Settings} />
      <label>{t('common.label.settings')}</label>
    </Flex>
    <Flex direction='column' gap={3} className='tool-bar-options'>
      {action.theme && (
        <Field className='tool-bar-option' direction='row' alignItems='center' justifyContent='space-between' gap={4}>
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
      <Field className='tool-bar-option' direction='row' alignItems='center' justifyContent='space-between' gap={4}>
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
      <Field className='tool-bar-option' direction='row' alignItems='center' justifyContent='space-between' gap={4}>
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
  </Flex>
);
