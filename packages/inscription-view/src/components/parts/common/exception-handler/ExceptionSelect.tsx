import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import type { Consumer } from '../../../../types/lambda';
import type { SelectItem } from '../../../widgets/select/Select';
import { Select } from '../../../widgets/select/Select';

type ExceptionSelectProps = {
  value: string;
  onChange: Consumer<string>;
  staticExceptions: string[];
};

const ExceptionSelect = ({ value, onChange, staticExceptions }: ExceptionSelectProps) => {
  const { elementContext } = useEditorContext();
  const items = [
    ...staticExceptions.map(ex => {
      return { label: ex, value: ex };
    }),
    ...useMeta('meta/workflow/errorStarts', elementContext, []).data.map<SelectItem>(error => {
      return { label: error.label, value: error.id };
    })
  ];
  const selectedItem = items.find(e => e.value === value) ?? { label: value, value };

  return <Select items={items} emptyItem={true} value={selectedItem} onChange={item => onChange(item.value)} />;
};

export default ExceptionSelect;
