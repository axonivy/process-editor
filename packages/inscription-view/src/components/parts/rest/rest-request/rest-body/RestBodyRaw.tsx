import { PathContext } from '../../../../../context/usePath';
import { MacroArea } from '../../../../widgets/code-editor/MacroArea';
import { ValidationFieldset } from '../../../common/path/validation/ValidationFieldset';
import { useRestRequestData } from '../../useRestRequestData';

export const RestBodyRaw = () => {
  const { config, updateBody } = useRestRequestData();
  return (
    <PathContext path='raw'>
      <ValidationFieldset>
        <MacroArea
          value={config.body.raw}
          onChange={change => updateBody('raw', change)}
          browsers={['attr', 'func', 'cms']}
          minHeight={250}
        />
      </ValidationFieldset>
    </PathContext>
  );
};
