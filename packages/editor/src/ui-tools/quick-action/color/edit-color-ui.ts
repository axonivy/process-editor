import { ChangeColorOperation } from '@axonivy/process-editor-protocol';
import type { IActionDispatcher, PaletteItem } from '@eclipse-glsp/client';
import { t } from 'i18next';
import { createElement } from '../../../utils/ui-utils';

export class EditColorUi {
  private editUi: HTMLElement;
  private item?: PaletteItem;
  private colorNameInput: HTMLInputElement;
  private colorInput: HTMLInputElement;
  private colorPickerInput?: HTMLInputElement;
  private colorPickerDecorator?: HTMLElement;
  private deleteBtn?: HTMLButtonElement;

  constructor(
    readonly actionDispatcher: IActionDispatcher,
    readonly elementIds: string[],
    containerElement: HTMLElement
  ) {
    this.editUi = this.createEditUi(containerElement);
  }

  public showEditUi(item?: PaletteItem): void {
    this.item = item;
    this.setInputValue(this.colorNameInput, item?.label);
    this.setInputValue(this.colorInput, item?.icon);
    this.setInputValue(this.colorPickerInput, item?.icon);
    if (this.colorPickerDecorator) {
      this.colorPickerDecorator.style.backgroundColor = item?.icon ?? '';
    }
    if (this.deleteBtn) {
      this.deleteBtn.style.display = item ? 'block' : 'none';
    }
    this.editUi.style.display = 'block';
  }

  private setInputValue(inputElement?: HTMLInputElement, value?: string): void {
    if (inputElement) {
      inputElement.value = value ?? '';
    }
  }

  private createEditUi(containerElement: HTMLElement): HTMLElement {
    const editUi = createElement('div', ['edit-color']);
    editUi.appendChild(this.createBody());
    editUi.appendChild(this.createFooter());
    containerElement.appendChild(editUi);
    return editUi;
  }

  private createBody(): HTMLElement {
    const body = createElement('div', ['edit-color-body']);
    const [nameDiv, nameInput] = this.createInput(t('common.label.name'), this.colorNameInput);
    body.appendChild(nameDiv);
    this.colorNameInput = nameInput;
    const [colorDiv, colorInput] = this.createInput(t('common.label.color'), this.colorInput, true);
    body.appendChild(colorDiv);
    this.colorInput = colorInput;
    return body;
  }

  private createInput(labelText: string, input?: HTMLInputElement, showColorPicker = false): [HTMLElement, HTMLInputElement] {
    const id = `input-${labelText}`;
    const div = createElement('div', ['edit-color-input']);
    const label = createElement('label') as HTMLLabelElement;
    label.htmlFor = id;
    label.textContent = labelText;
    div.appendChild(label);

    input = document.createElement('input');
    input.name = labelText;
    input.id = id;
    if (showColorPicker) {
      const colorDiv = createElement('div', ['color-picker']);
      this.colorPickerDecorator = createElement('span', ['decorator']);
      const colorInput = document.createElement('input');
      this.colorPickerDecorator.onclick = () => colorInput.click();
      colorInput.type = 'color';
      colorInput.onchange = e => this.colorInputChange(e.target);
      colorInput.onchange = e => this.colorInputChange(e.target);
      this.colorPickerInput = colorInput;
      colorDiv.appendChild(this.colorPickerDecorator);
      colorDiv.appendChild(colorInput);
      colorDiv.appendChild(input);
      div.appendChild(colorDiv);
    } else {
      div.appendChild(input);
    }
    return [div, input];
  }

  private colorInputChange(inputElement: EventTarget | null): void {
    if (inputElement instanceof HTMLInputElement && this.colorPickerInput && this.colorPickerDecorator && this.colorInput) {
      const value = inputElement.value;
      this.colorPickerInput.value = value;
      this.colorPickerDecorator.style.backgroundColor = value;
      this.colorInput.value = value;
    }
  }

  private createFooter(): HTMLElement {
    const footer = createElement('footer', ['edit-color-footer']);
    this.deleteBtn = createElement('button', ['edit-color-delete']) as HTMLButtonElement;
    this.deleteBtn.textContent = t('common.label.delete');
    this.deleteBtn.autofocus = true;
    this.deleteBtn.type = 'button';
    this.deleteBtn.onclick = () => this.deleteColor();
    const confirmBtn = createElement('button', ['edit-color-save']) as HTMLButtonElement;
    confirmBtn.textContent = t('common.label.save');
    confirmBtn.type = 'button';
    confirmBtn.onclick = () => this.validateInputsAndRun(() => this.changeColor());
    footer.appendChild(this.deleteBtn);
    footer.appendChild(confirmBtn);
    return footer;
  }

  private validateInputsAndRun(callable: () => void): void {
    const validNameInput = this.validateInput(this.colorNameInput);
    const validColorInput = this.validateInput(this.colorInput);
    if (validNameInput && validColorInput) {
      callable();
    }
  }

  private validateInput(inputElement?: HTMLInputElement): boolean {
    if (inputElement) {
      if (inputElement.value === '') {
        inputElement.classList.add('error');
        return false;
      } else {
        inputElement.classList.remove('error');
      }
    }
    return true;
  }

  deleteColor(): void {
    if (this.item) {
      this.actionDispatcher.dispatch(ChangeColorOperation.deleteColor({ elementIds: this.elementIds, oldColor: this.item.label }));
    }
  }

  changeColor(): void {
    const colorName = this.colorNameInput?.value ?? '';
    const color = this.colorInput?.value ?? '';
    this.actionDispatcher.dispatch(ChangeColorOperation.create({ elementIds: this.elementIds, color: color, colorName: colorName }));
  }
}
