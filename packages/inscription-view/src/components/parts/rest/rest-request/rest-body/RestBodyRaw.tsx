import { PathProvider } from '../../../../../context/usePath';
import { MacroArea } from '../../../../widgets/code-editor/MacroArea';
import { ValidationFieldset } from '../../../common/path/validation/ValidationFieldset';
import { useRestRequestData } from '../../useRestRequestData';

export const RestBodyRaw = () => {
  const { config, updateBody } = useRestRequestData();
  return (
    <PathProvider path='raw'>
      <ValidationFieldset>
        <MacroArea value={config.body.raw} onChange={change => updateBody('raw', change)} browsers={['attr', 'func', 'cms']} />
      </ValidationFieldset>
    </PathProvider>
  );
};
