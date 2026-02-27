import type { Plugin } from 'vite';

interface MonacoConfigOptions {
  supportedLocales?: string[];
  removeAsset?: (fileName: string) => boolean;
  logging?: boolean;
  ignorePackages?: string[];
}

// Language-specific workers that we don't need (we only use the editor.worker)
const UNUSED_WORKERS = ['ts.worker', 'css.worker', 'html.worker', 'json.worker'];
const isUnusedWorker = (fileName: string) => UNUSED_WORKERS.some(worker => fileName.includes(worker));

const PLUGIN_NAME = 'monaco-config-plugin';

function log(text: string, condition: boolean) {
  if (!condition) return;
  console.debug('%s %s', `\x1b[90m[${PLUGIN_NAME}]\x1b[0m`, `\x1b[32m${text}\x1b[0m`);
}

function nlsLanguage(path: string): string | undefined {
  const match = path.match(/monaco-editor\/esm\/nls\.messages\.([^.]+)\.js/);
  return match ? match[1] : undefined;
}

const monacoConfigPlugin = (options: MonacoConfigOptions = {}): Plugin => {
  const { supportedLocales = ['en', 'de'], logging = true, removeAsset = isUnusedWorker } = options;

  return {
    name: PLUGIN_NAME,
    config: () => ({
      build: {
        rollupOptions: {
          external: source => {
            const langMatch = nlsLanguage(source);
            if (langMatch && !supportedLocales.includes(langMatch)) {
              log(`Skip bundling: ${source}`, logging);
              return true;
            }
            return false;
          },
          output: {
            manualChunks: id => {
              // special handling for vite preload helper as otherwise they might be put into a lazy-loading chunk and cause dependencies to those chunks early on
              if (id.includes('vite/preload-helper.js')) {
                return 'preload';
              }
              if (id.includes('vite/modulepreload-polyfill.js')) {
                return 'module_preload';
              }

              if (!id.includes('node_modules')) {
                // only chunk dependencies, not our own code
                return;
              }

              const importPath = id.slice(id.lastIndexOf('node_modules/') + 'node_modules/'.length);
              const packageName = importPath.startsWith('@') ? importPath.split('/', 2).join('/') : (importPath.split('/', 1)[0] ?? id);

              if (options.ignorePackages?.includes(packageName)) {
                log(`Ignoring package for chunking: ${packageName}`, logging);
                return;
              }

              // chunk React seaparately as it is large and may be shared with other parts of the application
              if (packageName === 'react' || packageName === 'react-dom') {
                return 'react-chunk';
              }

              // keep editor separate as it is loaded only when needed
              if (packageName === '@monaco-editor/react') {
                return 'monaco-editor-react-chunk';
              }

              // keep language files separate as they are loaded only when needed
              const langMatch = nlsLanguage(id);
              if (langMatch) {
                return `monaco-lang-${langMatch}`;
              }

              // keep monaco API separate as it is loaded only when needed
              if (packageName === 'monaco-editor') {
                return 'monaco-editor-chunk';
              }

              return undefined; // natural rollup splitting
            }
          }
        },
        modulePreload: false
      },
      worker: {
        format: 'es'
      }
    }),
    generateBundle: (_, bundle) => {
      for (const fileName of Object.keys(bundle)) {
        if (removeAsset(fileName)) {
          log(`Removing asset: ${fileName}`, logging);
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete bundle[fileName];
        }
      }
    }
  };
};

export { monacoConfigPlugin as default, type MonacoConfigOptions };
