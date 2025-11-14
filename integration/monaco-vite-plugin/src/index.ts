import type { Plugin } from 'vite';

interface MonacoConfigOptions {
  supportedLocales?: string[];
  removeAsset?: (fileName: string) => boolean;
  logging?: boolean;
}

// the i18n json files are produced by language bundles that have translations for common extensions, e.g., json, css, Markdown, etc.
const isI18nAsset = (fileName: string) => fileName.includes('vscode') && fileName.includes('i18n') && fileName.endsWith('.json');

const PLUGIN_NAME = 'monaco-config-plugin';

function log(text: string, condition: boolean) {
  if (!condition) return;
  console.debug('%s %s', `\x1b[90m[${PLUGIN_NAME}]\x1b[0m`, `\x1b[32m${text}\x1b[0m`);
}

const monacoConfigPlugin = (options: MonacoConfigOptions = {}): Plugin => {
  const { supportedLocales = ['en', 'de'], logging = true, removeAsset = isI18nAsset } = options;

  return {
    name: PLUGIN_NAME,
    config: () => ({
      optimizeDeps: {
        exclude: ['@codingame/monaco-vscode-extension-api']
      },
      resolve: {
        alias: [{ find: /^vscode(\/.*)?$/, replacement: '@codingame/monaco-vscode-extension-api$1' }],
        dedupe: ['vscode', '@codingame/monaco-vscode-extension-api']
      },
      build: {
        rollupOptions: {
          external: source => {
            const langPackMatch = source.match(/@codingame\/monaco-vscode-language-pack-([^/]+)/);
            if (langPackMatch && langPackMatch[1] && !supportedLocales.includes(langPackMatch[1])) {
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

              // chunk React seaparately as it is large and may be shared with other parts of the application
              if (packageName === 'react' || packageName === 'react-dom') {
                return 'react-chunk';
              }

              // dedicated chunks for Monaco language packs as we load them lazily
              const langPackMatch = packageName.match(/monaco-vscode-language-pack-([^/]+)/);
              if (langPackMatch) {
                return `monaco-lang-${langPackMatch[1]}`;
              }

              // we either load the views OR the workbench OR the editor, depending on the view config type
              // loading all of them in a single chunk WILL cause problems as they perform different, global registrations
              // therefore separate chunks for them as well
              if (id.includes('monaco-vscode-views-service-override')) {
                return 'monaco-vscode-views-service-override';
              }
              if (id.includes('monaco-vscode-workbench-service-override')) {
                return 'monaco-vscode-workbench-service-override';
              }
              if (id.includes('monaco-vscode-editor-service-override')) {
                return 'monaco-vscode-editor-service-override';
              }

              // separating service overrides may cause problems as they depend on some of the core classes (e.g., Disposable)
              // so they cannot be loaded separately safely.
              // bundle up the rest that is usually loaded together
              if (packageName.includes('monaco-languageclient') || packageName.includes('vscode')) {
                return 'monaco-chunk';
              }

              // keep editor separate as it is loaded only when needed
              if (id.includes('monaco-editor')) {
                return 'monaco-editor-chunk';
              }

              return undefined; // natural rollup splitting
            }
          }
        },
        modulePreload: false
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
