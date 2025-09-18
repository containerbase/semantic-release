import { execa } from 'execa';
import {
  type PrepareContext,
  type PublishContext,
  type VerifyConditionsContext,
} from 'semantic-release';
import AggregateError from 'aggregate-error';
import getError from './get-error.ts';
import { getChannel } from './util.ts';

type PluginConfig = unknown;

/**
 * Verify that the environment and plugin configuration are ready for a semantic-release run. This
 * step is executed during the `verifyConditions` phase.
 *
 * The function delegates the heavy lifting to the local `verify` helper and caches the verification
 * result so that subsequent life-cycle steps can skip running the checks again.
 * @param pluginConfig Plugin configuration object.
 * @param context Semantic-release provided context.
 * @returns Resolves once verification has finished.
 */
export async function verifyConditions(
  _pluginConfig: PluginConfig,
  { cwd = '.', env, stderr, stdout, logger }: VerifyConditionsContext,
): Promise<void> {
  logger.log(`Verifying registry access`);

  const res = await execa(
    'pnpm',
    [
      '-r',
      'publish',
      '--dry-run',
      '--tag',
      'semantic-release-auth-check',
      '--no-git-checks',
    ],
    {
      cwd,
      env,
      stdout: ['pipe', stdout],
      stderr: ['pipe', stderr],
      lines: true,
    },
  );

  for (const line of [...res.stdout, ...res.stderr]) {
    if (line.includes('This command requires you to be logged in to ')) {
      throw new AggregateError([getError('EINVALIDNPMAUTH')]);
    }
  }
}

/**
 * Prepare the package for publication. On success the information is cached so that it is not
 * executed again during `publish` when running the single-package plugin flow.
 * @param pluginConfig Plugin configuration object.
 * @param context Semantic-release provided context.
 * @returns Resolves when preparation steps have completed.
 */
export async function prepare(
  _pluginConfig: unknown,
  {
    cwd = '.',
    env,
    stderr,
    stdout,
    logger,
    nextRelease: { version },
  }: PrepareContext,
): Promise<void> {
  // if (!verified) {
  //     await verify(pluginConfig, context);
  // }

  logger.log('Write version %s to package.json in %s', version, cwd);

  // update root `package.json`
  await execa(
    'pnpm',
    [
      'pnpm',
      'version',
      version,
      '--no-git-tag-version',
      '--allow-same-version',
    ],
    {
      cwd,
      env,
      stdout,
      stderr,
    },
  );

  // update other workspace `package.json`
  await execa(
    'pnpm',
    [
      '-r',
      'exec',
      'pnpm',
      'version',
      version,
      '--no-git-tag-version',
      '--allow-same-version',
    ],
    {
      cwd,
      env,
      stdout,
      stderr,
    },
  );

  // prepared = true;
}

export async function publish(
  _pluginConfig: unknown,
  {
    cwd = '.',
    env,
    stderr,
    stdout,
    logger,
    nextRelease: { channel, version },
  }: PublishContext,
): Promise<void> {
  const distributionTag = getChannel(channel);

  logger.log(
    `Publishing version ${version} to npm registry on dist-tag ${distributionTag}`,
  );

  await execa(
    'pnpm',
    ['-r', 'publish', '--tag', distributionTag, '--no-git-checks'],
    {
      cwd,
      env,
      stdout,
      stderr,
    },
  );
}
