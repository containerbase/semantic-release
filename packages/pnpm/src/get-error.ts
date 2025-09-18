import SemanticReleaseError from '@semantic-release/error';
import * as ERROR_DEFINITIONS from './definitions/errors.ts';
import type { ErrorContext } from './definitions/errors.ts';

export default (
  code: keyof typeof ERROR_DEFINITIONS,
  ctx: ErrorContext = {},
) => {
  // eslint-disable-next-line import-x/namespace
  const { message, details } = ERROR_DEFINITIONS[code](ctx);
  return new SemanticReleaseError(message, code, details);
};
