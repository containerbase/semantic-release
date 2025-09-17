import { build } from 'esbuild';
import pkg from '../packages/pnpm/package.json' with { type: 'json' };

const baseDir = './packages/pnpm';
const nodeVersion = 22;

await build({
  entryPoints: [`${baseDir}/src/index.ts`],
  bundle: true,
  packages: 'bundle',
  platform: 'node',
  target: `node${nodeVersion}`,
  minify: false,
  // tsconfig: 'tsconfig.dist.json',
  format: 'esm',
  outdir: `${baseDir}/lib`,
  banner: { js: '/* eslint-disable */ // @ts-nocheck' },
  external: Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies }),
});
