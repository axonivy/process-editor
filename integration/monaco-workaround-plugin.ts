import { type Plugin } from 'vite';

// Ignore 'webWorkerExtensionHostIframe.html'
// Seems to be broken since vite 7.0.5: https://github.com/vitejs/vite/pull/20376
export function monacoWorkaroundPlugin(): Plugin {
  return {
    name: 'monaco-worker-asset-resolver',
    // Use 'resolveId' to intercept import paths
    resolveId(source: string, importer: string | undefined) {
      // Check if the source matches the problematic import path
      // And if it's coming from monaco-languageclient
      if (source.includes('webWorkerExtensionHostIframe.html') && importer?.includes('monaco-languageclient.js')) {
        // You have a few options here:
        // Option A: Return a dummy module ID (effectively ignoring it if it's not truly needed for the build)
        // If this HTML file is truly only for a specific runtime scenario that your dev server doesn't need to serve,
        // or if Monaco handles it internally in a way that doesn't require Vite to bundle it,
        // you can return a string that Vite can resolve to an empty module.
        // For example, pointing to an empty JS file or a simple HTML string.
        // This is tricky because if Monaco actually needs this file at runtime, it will fail.
        console.warn(`[monaco-workaround-plugin] Ignoring problematic import: ${source}`);
        // return '\0monaco-ignore-iframe.html'; // A conventional way to return a virtual module ID
        //
        // Option B: Point to a non-existent file path if you are SURE it's not needed
        return 'virtual:non-existent-monaco-iframe.html'; // Or similar
        //
        // Option C: If you can provide a dummy HTML file, point to it.
        // For example, if you create an empty HTML file at `public/empty-iframe.html`, you could do:
        // return path.resolve(__dirname, 'public/empty-iframe.html');
      }
      return null; // Let other resolvers handle it
    }

    // Use 'load' to provide content for virtual modules
    // load(id: string) {
    //   if (id === '\0monaco-ignore-iframe.html') {
    //     // Provide minimal valid content for the "ignored" HTML file
    //     // A blank HTML document might be enough if the JS code that tries to load it
    //     // doesn't actually process its content much.
    //     return `<!DOCTYPE html><html><body></body></html>`;
    //   }
    //   return null; // Let other loaders handle it
    // }
  };
}
