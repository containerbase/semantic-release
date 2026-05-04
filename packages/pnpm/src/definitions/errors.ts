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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ENOPKGNAME(_ctx: ErrorContext) {
  return {
    message: 'Missing `name` property in `package.json`.',
    details: `The \`package.json\`'s [name](https://docs.npmjs.com/files/package.json#name) property is required in order to publish a package to the npm registry.

Please make sure to add a valid \`name\` for your package in your \`package.json\`.`,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ENOPKG(_ctx: ErrorContext) {
  return {
    message: 'Missing `package.json` file.',
    details: `A [package.json file](https://docs.npmjs.com/files/package.json) at the root of your project is required to release on npm.

Please follow the [npm guideline](https://docs.npmjs.com/getting-started/creating-node-modules) to create a valid \`package.json\` file.`,
  };
}
