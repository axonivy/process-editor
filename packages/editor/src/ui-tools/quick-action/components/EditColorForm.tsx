import { ChangeColorOperation } from '@axonivy/process-editor-protocol';
import { Label } from '@axonivy/ui-components';
import type { IActionDispatcherProvider, PaletteItem } from '@eclipse-glsp/client';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface EditColorFormProps {
  actionDispatcher: IActionDispatcherProvider;
  elementIds: string[];
  item?: PaletteItem;
  onClose: () => void;
}

export const EditColorForm: React.FC<EditColorFormProps> = ({ actionDispatcher, elementIds, item, onClose }) => {
  const { t } = useTranslation();
  const [colorName, setColorName] = React.useState(item?.label ?? '');
  const [color, setColor] = React.useState(item?.icon ?? '#000000');
  const [nameError, setNameError] = React.useState(false);
  const [colorError, setColorError] = React.useState(false);

  React.useEffect(() => {
    setColorName(item?.label ?? '');
    setColor(item?.icon ?? '#000000');
    setNameError(false);
    setColorError(false);
  }, [item]);

  const validateInputs = (): boolean => {
    const isNameValid = colorName.trim() !== '';
    const isColorValid = color.trim() !== '';

    setNameError(!isNameValid);
    setColorError(!isColorValid);

    return isNameValid && isColorValid;
  };

  const handleSave = async () => {
    if (validateInputs()) {
      const dispatcher = await actionDispatcher();
      dispatcher.dispatch(
        ChangeColorOperation.create({
          elementIds,
          color: color,
          colorName: colorName
        })
      );
      onClose();
    }
  };

  const handleDelete = async () => {
    if (item) {
      const dispatcher = await actionDispatcher();
      dispatcher.dispatch(
        ChangeColorOperation.deleteColor({
          elementIds,
          oldColor: item.label
        })
      );
      onClose();
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    if (colorError && e.target.value.trim() !== '') {
      setColorError(false);
    }
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorName(e.target.value);
    if (nameError && e.target.value.trim() !== '') {
      setNameError(false);
    }
  };

  return (
    <div className='edit-color'>
      <div className='edit-color-body'>
        <div className='edit-color-input'>
          <Label htmlFor='color-name-input'>{t('common.label.name')}</Label>
          <input
            id='color-name-input'
            value={colorName}
            onChange={handleNameInputChange}
            placeholder={t('common.label.name')}
            className={nameError ? 'error' : ''}
          />
        </div>

        <div className='edit-color-input'>
          <Label htmlFor='color-input'>{t('common.label.color')}</Label>
          <div className='color-picker'>
            <span
              className='decorator'
              style={{
                backgroundColor: color
              }}
              onClick={() => document.getElementById('color-picker-input')?.click()}
            />
            <input id='color-picker-input' type='color' value={color} onChange={handleColorInputChange} />
            <input
              id='color-input'
              value={color}
              onChange={handleColorInputChange}
              placeholder='#000000'
              className={colorError ? 'error' : ''}
            />
          </div>
        </div>
      </div>

      <footer className='edit-color-footer'>
        {item && (
          <button type='button' onClick={handleDelete} className='edit-color-delete' autoFocus={true}>
            {t('common.label.delete')}
          </button>
        )}
        <button type='button' onClick={handleSave} className='edit-color-save'>
          {t('common.label.save')}
        </button>
      </footer>
    </div>
  );
};
