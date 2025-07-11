import type { CacheArtifact, CacheMode } from '@axonivy/process-editor-inscription-protocol';
import { IVY_SCRIPT_TYPES } from '@axonivy/process-editor-inscription-protocol';
import { useTranslation } from 'react-i18next';
import type { DataUpdater } from '../../../types/lambda';
import { ScriptInput } from '../../widgets/code-editor/ScriptInput';
import Radio from '../../widgets/radio/Radio';
import { PathCollapsible, type PathCollapsibleProps } from '../common/path/PathCollapsible';
import { PathFieldset } from '../common/path/PathFieldset';

type CacheLifetimeProps = Omit<PathCollapsibleProps, 'children'> & {
  description: string;
  config: CacheArtifact;
  updater: DataUpdater<CacheArtifact>;
  cacheMode: CacheMode;
};

export const CacheLifetime = ({ description, config, updater, cacheMode, ...props }: CacheLifetimeProps) => {
  const { t } = useTranslation();
  return (
    <PathCollapsible defaultOpen={true} {...props}>
      <PathFieldset label={t('common.label.name')} title={description} path='name'>
        <ScriptInput
          value={config.name}
          onChange={change => updater('name', change)}
          type={IVY_SCRIPT_TYPES.STRING}
          browsers={['attr', 'func', 'type', 'cms']}
        />
      </PathFieldset>
      {cacheMode === 'CACHE' && (
        <PathFieldset label={t('part.cache.lifetime')} path='time'>
          <Radio
            value={config.invalidation}
            onChange={change => updater('invalidation', change)}
            items={[
              { label: t('part.cache.lifetimeMode.forever'), value: 'NONE' },
              { label: t('part.cache.lifetimeMode.fixed'), value: 'FIXED_TIME' },
              { label: t('part.cache.lifetimeMode.duration'), value: 'LIFETIME' }
            ]}
            orientation='horizontal'
          />
          {config.invalidation !== 'NONE' && (
            <ScriptInput
              value={config.time}
              onChange={change => updater('time', change)}
              type={config.invalidation === 'FIXED_TIME' ? IVY_SCRIPT_TYPES.TIME : IVY_SCRIPT_TYPES.NUMBER}
              browsers={['attr', 'func', 'type', 'cms']}
            />
          )}
        </PathFieldset>
      )}
    </PathCollapsible>
  );
};
