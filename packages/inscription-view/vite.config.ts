import packageJson from './package.json' with { type: 'json' };
import { resolve } from 'path';
import { defineConfig } from 'vite';

const dependencies = Object.keys({ ...packageJson.dependencies, ...packageJson.peerDependencies });

export default defineConfig({
  oxc: {
    decorator: {
      legacy: true,
      emitDecoratorMetadata: true
    }
  },
  build: {
    outDir: 'lib',
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      fileName: 'inscription-view',
      cssFileName: 'inscription-view',
      formats: ['es']
    },
    rolldownOptions: {
      external: id => dependencies.some(dependency => id === dependency || id.startsWith(`${dependency}/`))
    }
  }
});
