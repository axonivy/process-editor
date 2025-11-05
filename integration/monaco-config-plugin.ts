import { type Plugin } from 'vite';

export function monacoConfigPlugin(): Plugin {
  return {
    name: 'monaco-config-plugin',
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
          output: {
            manualChunks: id => {
              if (!id.includes('node_modules')) {
                // only chunk dependencies, not our own code
                return;
              }
              // separate chunks for Monaco language packs as we do not want to load them all
              const langPackMatch = id.match(/@codingame\/monaco-vscode-language-pack-([^\/]+)/);
              if (langPackMatch) {
                return `monaco-lang-${langPackMatch[1]}`;
              }
              // we either load the views OR the workbench OR the editor, depending on the view config type
              // loading all of them in a single chunk WILL cause problems as they perform different, global registrations
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
              if (id.includes('monaco-languageclient') || id.includes('vscode')) {
                return 'monaco-chunk';
              }
              // keep editor separate as it is loaded only when needed
              if (id.includes('monaco-editor')) {
                return 'monaco-editor-chunk';
              }
            }
          }
        }
      }
    })
  };
}
