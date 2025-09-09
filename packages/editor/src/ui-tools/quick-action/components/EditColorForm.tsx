import { ChangeColorOperation } from '@axonivy/process-editor-protocol';
import { BasicInput, Button, Field, Flex, Label } from '@axonivy/ui-components';
import { type IActionDispatcherProvider, type PaletteItem } from '@eclipse-glsp/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { isNewColorPaletteItem } from './ColorPaletteItem';

interface EditColorFormProps {
  actionDispatcher: IActionDispatcherProvider;
  elementIds: string[];
  item: PaletteItem;
  onSave: () => void;
  onDelete: () => void;
}

export const EditColorForm: React.FC<EditColorFormProps> = ({ actionDispatcher, elementIds, item, onSave, onDelete }) => {
  const { t } = useTranslation();

  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const colorInputRef = React.useRef<HTMLInputElement>(null);

  const [colorName, setColorName] = React.useState(() => (isNewColorPaletteItem(item) ? '' : (item?.label ?? '')));
  const [color, setColor] = React.useState(() => (isNewColorPaletteItem(item) ? '#000000' : (item?.icon ?? '#000000')));

  React.useEffect(() => {
    if (isNewColorPaletteItem(item)) {
      nameInputRef.current?.select();
    } else {
      colorInputRef.current?.select();
    }
  }, [item]);

  const isValid = () => colorName.trim().length > 0 && color.trim().length > 0;

  const handleSave = async () => {
    if (isValid()) {
      const dispatcher = await actionDispatcher();
      await dispatcher.dispatch(ChangeColorOperation.create({ elementIds, color, colorName }));
      onSave();
    }
  };

  const handleDelete = async () => {
    if (item) {
      const dispatcher = await actionDispatcher();
      await dispatcher.dispatch(ChangeColorOperation.deleteColor({ elementIds, oldColor: item.label }));
      onDelete();
    }
  };

  return (
    <Flex className='edit-color' gap={2} direction='column'>
      <Flex className='edit-color-body' gap={2} direction='row'>
        <Field className='edit-color-input'>
          <Label htmlFor='color-name-input'>{t('common.label.name')}</Label>
          <BasicInput
            id='color-name-input'
            ref={nameInputRef}
            value={colorName}
            onChange={e => setColorName(e.target.value)}
            required={true}
          />
        </Field>

        <Field className='edit-color-input'>
          <Label htmlFor='color-input'>{t('common.label.color')}</Label>
          <div className='color-picker'>
            <span
              className='decorator'
              style={{ backgroundColor: color }}
              onClick={() => document.getElementById('color-picker-input')?.click()}
            />
            <input id='color-picker-input' type='color' value={color} onChange={e => setColor(e.target.value)} />
            <BasicInput
              id='color-input'
              ref={colorInputRef}
              value={color}
              onChange={e => setColor(e.target.value)}
              placeholder={t('common.label.color')}
              required={true}
            />
          </div>
        </Field>
      </Flex>

      <Flex className='edit-color-footer' justifyContent='flex-end' gap={2}>
        {!isNewColorPaletteItem(item) && (
          <Button onClick={handleDelete} className='edit-color-delete' variant='outline'>
            {t('common.label.delete')}
          </Button>
        )}
        <Button onClick={handleSave} className='edit-color-save' disabled={!isValid()} variant='primary'>
          {t('common.label.save')}
        </Button>
      </Flex>
    </Flex>
  );
};
