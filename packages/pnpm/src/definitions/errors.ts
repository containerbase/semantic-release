export type ErrorContext = unknown;

export interface ErrorDetails {
  readonly message: string;
  readonly details?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function EINVALIDNPMAUTH(_ctx: ErrorContext): ErrorDetails {
  return {
    message: 'Invalid npm authentication.',
    details: `The authentication required to publish is not configured as needed.

Please verify your authentication configuration.`,
  };
}
