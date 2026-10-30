import path from 'node:path';
import { build } from 'esbuild';

const baseDir = './packages/pnpm';
const nodeVersion = 22;

// build pnpm package
await build({
  absWorkingDir: path.resolve(import.meta.dirname, '..', baseDir),
  entryPoints: ['src/index.ts'],
  bundle: true,
  packages: 'external',
  platform: 'node',
  target: `node${nodeVersion}`,
  minify: false,
  format: 'esm',
  outdir: 'lib',
  banner: { js: '/* oxlint-disable */ // @ts-nocheck' },
});
