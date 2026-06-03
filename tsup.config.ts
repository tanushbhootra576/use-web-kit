import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    external: ['react', 'react-dom'],
    treeshake: true,
    splitting: false,
    outExtension({ format }) {
        return { js: format === 'cjs' ? '.cjs' : '.mjs' };
    },
    banner: {
        js: '"use client";'
    }
});
