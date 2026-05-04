import path from 'path';
import { readPackage } from 'read-pkg';
import AggregateError from 'aggregate-error';
import getError from './get-error.ts';

export async function getPkg(cwd: string, pkgRoot?: string) {
  try {
    const pkg = await readPackage({
      cwd: pkgRoot ? path.resolve(cwd, pkgRoot) : cwd,
    });

    if (!pkg.name) {
      throw getError('ENOPKGNAME');
    }

    return pkg;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new AggregateError([getError('ENOPKG')]);
    }

    throw new AggregateError([error as Error]);
  }
}
