import { useMemo } from 'react';
import { useRestRequestData } from '../../useRestRequestData';
import type { HttpMethod, RestResource } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES, HTTP_METHOD } from '@axonivy/process-editor-inscription-protocol';
import './RestMethodSelect.css';
import { useUpdateRestResource } from '../../useUpdateRestResource';
import { Field, Flex } from '@axonivy/ui-components';
import type { ComboboxItem } from '../../../../widgets/combobox/Combobox';
import { useEditorContext } from '../../../../../context/useEditorContext';
import { useMeta } from '../../../../../context/useMeta';
import type { SelectItem } from '../../../../widgets/select/Select';
import { useOpenApi } from '../../../../../context/useOpenApi';
import { PathFieldset } from '../../../common/path/PathFieldset';
import Combobox from '../../../../widgets/combobox/Combobox';
import Select from '../../../../widgets/select/Select';
import InputWithBrowser from '../../../../widgets/input/InputWithBrowser';

type RestMethodItem = ComboboxItem & RestResource;

export const RestMethodSelect = () => {
  const { config, update, updateTarget, updateParameters } = useRestRequestData();
  const { updateResource } = useUpdateRestResource();

  const { context } = useEditorContext();
  const items = useMeta('meta/rest/resources', { context, clientId: config.target.clientId }, []).data.map<RestMethodItem>(res => {
    return { ...res, value: `${res.method.httpMethod}:${res.path}` };
  });
  const methodItems = useMemo<SelectItem[]>(() => Object.entries(HTTP_METHOD).map(([value, label]) => ({ label, value })), []);

  const comboboxItem = (item: RestMethodItem) => {
    const tooltip = `${item.method.httpMethod} ${item.path}${item.doc && item.doc.length > 0 ? ` - ${item.doc}` : ''}`;
    return (
      <>
        <div title={tooltip} aria-label={tooltip}>
          <span className='combobox-method'>{item.method.httpMethod}</span>
          <span>{item.path}</span>
          {item.doc && item.doc.length > 0 && <span className='combobox-menu-entry-additional'>{` - ${item.doc}`}</span>}
        </div>
      </>
    );
  };

  const { openApi } = useOpenApi();
  return (
    <PathFieldset label='Resource' path='path'>
      {items.length > 0 && openApi ? (
        <Combobox
          value={`${config.method}:${config.target.path}`}
          onChange={value =>
            updateResource(
              value,
              items.find(i => i.value === value)
            )
          }
          items={items}
          comboboxItem={comboboxItem}
        />
      ) : (
        <Flex direction='row' gap={2} className='rest-method-input'>
          <Select
            value={{ label: config.method, value: config.method }}
            onChange={item => update('method', item.value as HttpMethod)}
            items={methodItems}
          />
          <Field>
            <InputWithBrowser
              value={config.target.path}
              onChange={change => updateTarget('path', change)}
              type={IVY_SCRIPT_TYPES.STRING}
              modifyAction={value => {
                updateParameters({
                  queryParams: config.target.queryParams,
                  templateParams: { ...config.target.templateParams, [value]: value }
                });
                return `${config.target.path}{${value}}`;
              }}
              browsers={['attr']}
            />
          </Field>
        </Flex>
      )}
    </PathFieldset>
  );
};
