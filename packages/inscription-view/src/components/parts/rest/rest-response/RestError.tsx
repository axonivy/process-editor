import { IVY_EXCEPTIONS } from '@axonivy/process-editor-inscription-protocol';
import { useEditorContext } from '../../../../context/useEditorContext';
import { useMeta } from '../../../../context/useMeta';
import { classifiedItemInfo } from '../../../../utils/event-code-categorie';
import { ExceptionCombobox, type ExceptionItem } from '../../common/exception-handler/ExceptionCombobox';
import { PathFieldset, type PathFieldsetProps } from '../../common/path/PathFieldset';

type RestErrorProps = Omit<PathFieldsetProps, 'value' | 'onChange' | 'children'> & {
  value: string;
  onChange: (change: string) => void;
};

export const RestError = ({ label, path, value, onChange }: RestErrorProps) => {
  const { context } = useEditorContext();
  const items: ExceptionItem[] = [
    { value: IVY_EXCEPTIONS.rest, label: IVY_EXCEPTIONS.rest },
    { value: IVY_EXCEPTIONS.ignoreError, label: IVY_EXCEPTIONS.ignoreError },
    ...useMeta('meta/workflow/errorCodes', { context, thrower: true }, []).data.map(code => {
      return {
        value: code.eventCode,
        label: code.eventCode,
        info: classifiedItemInfo(code)
      };
    })
  ];

  return (
    <PathFieldset label={label} path={path}>
      <ExceptionCombobox value={value} onChange={onChange} items={items} />
    </PathFieldset>
  );
};
