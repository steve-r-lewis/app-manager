### Developer Guide: Headless Mode & E2E Testing

This document outlines the architecture for "Headless" CLI commands in `app-manager` and the "Black Box" testing strategy used to verify them.

---

### 1. What is Headless Mode?

Headless Mode allows `app-manager` commands to be executed purely via command-line arguments, bypassing interactive menus. This is essential for:

* **Automation:** Scripting operations without user input.
* **Testing:** Verifying critical paths in CI/CD environments.

**Core Convention:**
All commands should check for arguments first. If valid arguments are present, the command executes immediately. If arguments are missing, it falls back to interactive prompts.

**Example:**

* **Interactive:** `am utils contributor` → *Prompts for Name, Email*
* **Headless:** `am utils contributor "Steve" "steve@example.com"` → *Executes immediately*

---

### 2. Implementation Pattern

To migrate a command to Headless Mode, follow these two steps.

#### Step A: Update the Command Function

Modify the command signature to accept an optional `options` object.

```typescript
// app/commands/helpers/exampleCommand.ts

export interface ExampleOptions {
    name?: string; // Define arguments here
}

export async function exampleCommand(targetRoot: string, options: ExampleOptions = {}) {
    // 1. Check Options (Headless Priority)
    let name = options.name;

    // 2. Fallback to Prompt (Interactive)
    if (!name) {
        name = await text({ message: 'Enter Name:' });
    }

    // 3. Execution Logic
    // ...
}

```

#### Step B: Add Routing in `app.ts`

Update the `main()` function in `app/app.ts` to parse raw arguments and pass them to your command.

```typescript
// app/app.ts

    // ... inside Headless Routing block ...

    if (domainArg === 'helpers' && commandArg === 'example') {
        const name = args[2]; // Map args by index

        if (!name) {
            logger.error('Usage: helpers example "Name"');
            process.exit(1);
        }

        // Execute Headless
        await exampleCommand(targetRoot, { name });
        return; 
    }

```

---

### 3. Black Box E2E Testing Strategy

We verify Headless commands using a **"Black Box"** pattern. This spawns the actual CLI binary in a child process, ensuring the test covers the entire stack (parsing, routing, and execution).

#### The Test Template

Create your test in `tests/e2e/commands/<domain>/<command>.test.ts`.

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { setupTestContext } from '../../../helpers/testContext';

const execPromise = promisify(exec);
const CLI_ENTRY = path.resolve(__dirname, '../../../../index.ts');

describe('E2E: Example Command (Black Box)', () => {
    let ctx: ReturnType<typeof setupTestContext>;

    beforeEach(() => { ctx = setupTestContext(); });
    afterEach(() => { ctx.restore(); });

    it('should execute successfully via CLI args', async () => {
        // 1. Run the CLI
        await execPromise(`npx tsx ${CLI_ENTRY} utils example "TestName"`, {
            cwd: ctx.targetRoot,
            env: { 
                ...process.env,
                AM_DEBUG_ARGS: 'true' // Enable debug reporting (see below)
            }
        });

        // 2. Verify Side Effects (File creation, content updates, etc.)
        // Do NOT rely on function return values. Check disk state.
    });
});

```

---

### 4. Debugging Tests

Since tests run in a separate process, `console.log` output can be lost if the process crashes or hangs. We use a **Debug File Mechanism** to solve this.

#### How It Works

1. **Trigger:** Set the environment variable `AM_DEBUG_ARGS: 'true'` in your test configuration.
2. **Action:** `app.ts` writes a file named `debug_args.json` to the test root immediately upon startup.
3. **Result:** This file persists even if the app crashes, allowing you to inspect exactly what arguments the CLI received.

#### Lifecycle Diagram

| Phase | Location | Responsibility |
| --- | --- | --- |
| **Creation** | `ctx.targetRoot/debug_args.json` | `app.ts` (Startup) |
| **Inspection** | Read via `fs.readFileSync` | Developer / Test Runner |
| **Cleanup** | Deleted automatically | `ctx.restore()` (Teardown) |

#### Debugging Snippet

Add this to your test's `catch` block to print the debug info automatically on failure:

```typescript
    } catch (error) {
        const debugFile = path.join(ctx.targetRoot, 'debug_args.json');
        if (fs.existsSync(debugFile)) {
            console.log('🔍 DEBUG ARGS:', fs.readFileSync(debugFile, 'utf-8'));
        }
        throw error;
    }

```