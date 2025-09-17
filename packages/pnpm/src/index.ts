import { validRange } from 'semver';
import { execa } from 'execa';
import { type PrepareContext, type PublishContext } from 'semantic-release';

/**
 * Map a semantic-release `channel` value to the dist-tag that should be used when publishing to the
 * npm registry.
 *
 * If the provided channel is a valid semver range (`1.x`, `2&amp;#x2F;beta`, …) it will be prefixed with
 * `release-` to avoid clashes with the default tags like `latest` or `next` (mirrors the behaviour of
 * the official npm plugin). Otherwise the value is returned unchanged. When the channel is `null` or
 * `undefined` the function returns the default tag `latest`.
 * @param channel – The channel coming from `context.nextRelease.channel`.
 * @returns The npm dist-tag that should be used for the publish operation.
 */
function getChannel(channel: string | null | undefined): string {
  return channel
    ? validRange(channel)
      ? `release-${channel}`
      : channel
    : 'latest';
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
      preferLocal: true,
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
      preferLocal: true,
    },
  );
}
