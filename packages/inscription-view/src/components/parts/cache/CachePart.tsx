import type { CacheData } from '@axonivy/process-editor-inscription-protocol';
import { usePartDirty, usePartState, type PartProps } from '../../../components/editors/part/usePart';
import { useCacheData } from './useCacheData';
import { CacheLifetime } from './CacheLifetime';
import { useValidations } from '../../../context/useValidation';
import { PathContext } from '../../../context/usePath';
import Radio from '../../widgets/radio/Radio';
import Collapsible from '../../widgets/collapsible/Collapsible';
import { useTranslation } from 'react-i18next';

export function useCachePart(): PartProps {
  const { t } = useTranslation();
  const { config, defaultConfig, initConfig, reset } = useCacheData();
  const compareData = (data: CacheData) => [data.cache];
  const validation = useValidations(['cache']);
  const state = usePartState(compareData(defaultConfig), compareData(config), validation);
  const dirty = usePartDirty(compareData(initConfig), compareData(config));
  return { name: t('part.cache.title'), state, reset: { dirty, action: () => reset() }, content: <CachePart /> };
}

const CachePart = () => {
  const { t } = useTranslation();
  const { config, update, updateGroup, updateEntry } = useCacheData();
  return (
    <PathContext path='cache'>
      <Radio
        value={config.cache.mode}
        onChange={change => update('mode', change)}
        items={[
          { label: t('part.cache.mode.noCache'), value: 'DO_NOT_CACHE', description: t('part.cache.mode.noCacheMode') },
          { label: t('part.cache.mode.cache'), value: 'CACHE', description: t('part.cache.mode.cacheDesc') },
          {
            label: t('part.cache.mode.invalidate'),
            value: 'INVALIDATE_CACHE',
            description: t('part.cache.mode.invalidateMode')
          }
        ]}
        style={{ paddingInline: 'var(--size-2)' }}
      />
      {config.cache.mode !== 'DO_NOT_CACHE' && (
        <>
          <Collapsible label={t('part.cache.scope')} defaultOpen={true}>
            <Radio
              value={config.cache.scope}
              onChange={change => update('scope', change)}
              items={[
                { label: t('part.cache.scopeMode.session'), value: 'SESSION', description: t('part.cache.scopeMode.sessionDesc') },
                {
                  label: t('part.cache.scopeMode.application'),
                  value: 'APPLICATION',
                  description: t('part.cache.scopeMode.applicationDesc')
                }
              ]}
            />
          </Collapsible>
          <CacheLifetime
            path='group'
            label={t('part.cache.group')}
            description={t('part.cache.groupDesc')}
            config={config.cache.group}
            updater={updateGroup}
            cacheMode={config.cache.mode}
          />
          <CacheLifetime
            path='entry'
            label={t('part.cache.entry')}
            description={t('part.cache.entryDesc')}
            config={config.cache.entry}
            updater={updateEntry}
            cacheMode={config.cache.mode}
          />
        </>
      )}
    </PathContext>
  );
};
