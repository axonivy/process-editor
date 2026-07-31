import type {
  ConfigurationData,
  MultiSelect,
  Script,
  Text,
  Widget,
  Label as WidgetLabel
} from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { Field, Label, Message } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { useValidations } from '../../../../context/useValidation';
import { usePartState, type PartProps } from '../../../editors/part/usePart';
import { MacroArea } from '../../../widgets/code-editor/MacroArea';
import { MacroInput } from '../../../widgets/code-editor/MacroInput';
import { ScriptInput } from '../../../widgets/code-editor/ScriptInput';
import { MultiSelectWidget } from '../../../widgets/multi-select/MultiSelectWidget';
import { PathCollapsible } from '../../common/path/PathCollapsible';
import './Configuration.css';
import { useConfigurationData } from './useConfigurationData';

export function useConfigurationPart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig } = useConfigurationData();
  const compareData = (data: ConfigurationData) => [data.userConfig];
  const validation = useValidations(['userConfig']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  return {
    id: 'Configuration',
    name: t('part.program.configuration.title'),
    state,
    content: <ConfigurationPart />,
    icon: IvyIcons.Configuration
  };
}

const ConfigurationPart = () => {
  const { t } = useTranslation();
  const { config } = useConfigurationData();
  const { context } = useEditorContext();
  const editorItems = useMeta('meta/program/editor', { context, type: config.javaClass }, []).data;

  return (
    <>
      {editorItems.length === 0 ? (
        <PathCollapsible label={t('part.program.configuration.title')} defaultOpen={true} path={'userConfig'}>
          <Message message='No configuration needed' variant='info' />
        </PathCollapsible>
      ) : (
        editorItems.map((group, index) => (
          <PathCollapsible label={group.name} defaultOpen={index === 0} path={'userConfig'} key={group.name}>
            {group.widgets.map((widget, wIndex) => (
              // eslint-disable-next-line @eslint-react/no-array-index-key
              <Field className='configuration-widget' key={wIndex}>
                <Widget widget={widget} />
              </Field>
            ))}
          </PathCollapsible>
        ))
      )}
    </>
  );
};

const Widget = ({ widget }: { widget: Widget }) => {
  const { config, updateUserConfig } = useConfigurationData();
  if (isLabel(widget)) {
    const message = widget.text;

    if (widget.multiline) {
      const sentences = message.split('\n');
      return (
        <div className='info-text'>
          {sentences.map((sentence, index) => (
            // eslint-disable-next-line @eslint-react/no-array-index-key
            <p key={index}>{sentence?.length > 0 ? sentence : ' '}</p>
          ))}
        </div>
      );
    } else {
      return <div className='info-text'>{message}</div>;
    }
  }
  if (isScript(widget)) {
    const typeToUse = widget.requiredType || IVY_SCRIPT_TYPES.STRING;
    return (
      <>
        {widget.label && <Label>{widget.label}</Label>}
        <ScriptInput
          type={typeToUse}
          value={config.userConfig[widget.configKey] ?? ''}
          aria-label={widget.configKey}
          onChange={change => updateUserConfig(widget.configKey, change)}
          browsers={['attr', 'func', 'type', 'cms']}
        />
        {widget.help && <Message message={widget.help} variant='info' />}
      </>
    );
  }
  if (isText(widget)) {
    if (widget.multiline) {
      return (
        <>
          {widget.label && <Label>{widget.label}</Label>}
          <MacroArea
            value={config.userConfig[widget.configKey] ?? ''}
            aria-label={widget.configKey}
            minHeight={90}
            onChange={change => updateUserConfig(widget.configKey, change)}
            browsers={['attr', 'func', 'cms']}
          />
          {widget.help && <Message message={widget.help} variant='info' />}
        </>
      );
    }
    return (
      <>
        {widget.label && <Label>{widget.label}</Label>}
        <MacroInput
          value={config.userConfig[widget.configKey] ?? ''}
          aria-label={widget.configKey}
          onChange={change => updateUserConfig(widget.configKey, change)}
          browsers={['attr', 'func', 'cms']}
        />
        {widget.help && <Message message={widget.help} variant='info' />}
      </>
    );
  }
  if (isMultiSelect(widget)) {
    const selectedValue = config.userConfig[widget.configKey] ?? '';
    const value = typeof selectedValue === 'string' && selectedValue.length > 0 ? selectedValue.split(',').map(v => v.trim()) : [];
    return (
      <>
        {widget.label && <Label>{widget.label}</Label>}
        <MultiSelectWidget
          value={value}
          onChange={change => updateUserConfig(widget.configKey, change.join(', '))}
          items={widget.items}
          configKey={widget.configKey}
        />
        {widget.help && <Message message={widget.help} variant='info' />}
      </>
    );
  }
  return null;
};

type LabelWidget = WidgetLabel & { widgetType: 'LABEL' };
type ScriptWidget = Script & { widgetType: 'SCRIPT' };
type TextWidget = Text & { widgetType: 'TEXT' };
type MultiSelectWidgetType = MultiSelect & { widgetType: 'MULTI_SELECT' };

function isLabel(object: Widget): object is LabelWidget {
  return object.widgetType === 'LABEL';
}

function isScript(object: Widget): object is ScriptWidget {
  return object.widgetType === 'SCRIPT';
}

function isText(object: Widget): object is TextWidget {
  return object.widgetType === 'TEXT';
}

function isMultiSelect(object: Widget): object is MultiSelectWidgetType {
  return object.widgetType === 'MULTI_SELECT';
}
