# How to Contribute

We welcome contributions! Here is how to add a new feature to App Manager.

## Workflow

1.  **Create a Branch**: `git checkout -b feat/my-new-command`
2.  **Develop**:
    * Create your command file in `app/commands/<domain>/myCommand.ts`.
    * Export a function `export async function myCommand(targetRoot: string) { ... }`.
3.  **Test**:
    * Create a test file `tests/commands/<domain>/myCommand.test.ts`.
    * Ensure you mock `clack/prompts` and any services.
    * Run `pnpm test` to ensure no regressions.
4.  **Register**:
    * Import your command in `app/app.ts`.
    * Add it to the menu `options` array.
    * Add a case to the `switch` statement.

## Coding Standards

* **TypeScript**: Strict mode is enabled. No `any` unless absolutely necessary.
* **Prompts**: Use `@clack/prompts` for all user input to maintain UI consistency.
* **Filesystem**: Use `fs` or `fs-extra`. Always use `path.join()` for cross-platform compatibility.