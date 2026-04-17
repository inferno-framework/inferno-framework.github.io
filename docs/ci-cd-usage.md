---
title: CI/CD Usage
nav_order: 26
layout: docs
section: docs
---

# Using Test Kits in CI/CD

Inferno provides two CLI options for executing Inferno tests via the command line:
1. The [`inferno execute_script`](/docs/getting-started/inferno-cli.html#complex-scripted-execution) CLI command for more complex executions that can involve multiple runs
   and sessions as well as scripting of external systems.
2. The [`inferno execute`](/docs/getting-started/inferno-cli.html#simple-execution) CLI command for execution of a single suite, group, or test.

## Using the `inferno execute_script` CLI for Complex Orchestration

The [`inferno execute_script`](/docs/getting-started/inferno-cli.html#complex-scripted-execution)
command is well-suited for use in CI/CD pipelines. To enable this use,
the [Inferno Template Test Kit](https://github.com/inferno-framework/inferno-template) provides
a [standard Github Workflow file](https://github.com/inferno-framework/inferno-template/blob/main/.github/workflows/run_inferno_execution_scripts.yml)
that finds [script configuration files](/docs/advanced-test-features/scripting-execution.html#creating-script-configuration-files)
defined under the `execution_scripts` directory and runs each of them against a freshly
created Inferno instance running the test kit defined in the repository. This script is
trigged automatically on pull requests opened against the main branch and can also be
manually triggered.

Key considerations when using this GitHub workflow:
- [Script configuration files](/docs/advanced-test-features/scripting-execution.html#creating-script-configuration-files)
  defined anywhere under the `execution_scripts` directory will be identified and executed.
- All executed scripts are expected to complete successfully with the expected results.
- Scripts that end in `_with_commands.yaml` will be run with the `--allow-commands` flag of the
  `execute_script` CLI set. Use that naming convention whenever your scripts include `command`
  actions.
- Any `command` action scripts must be runnable on a `ubuntu-latest` using the contents of the
  repository with Inferno's standard Ruby setup. You can modify the workflow if your commands
  require additional setup to execute.

### Investigating github workflow failures

The [standard Github Workflow file](https://github.com/inferno-framework/inferno-template/blob/main/.github/workflows/run_inferno_execution_scripts.yml)
will output debugging artifacts including
- The inferno test kit process log
- Docker container logs
- Actual result json and comparison analysis csv files

Note that in cases where the script execution does not perform the
results comparison and no actual result files are generated because
there was an `error` result in a test, the error will be present
in the inferno process log for debugging purposes.

## Using the `inferno execute` CLI for Simple Execution

To run Inferno using the [inferno
execute](/docs/getting-started/inferno-cli.html#simple-execution)
CLI command, follow these steps:

 1. Setup a container or environment with Ruby and Docker
 2. Obtain your target Test Kit version and make it your working directory
 3. Launch background Inferno services: `bundle exec inferno services start`. This
command works on top of docker compose and daemonizes the processes for you.
 4. Confirm that background services are ready, possibly with the [wait-for](https://github.com/eficode/wait-for) script.
 5. Launch the system under test and confirm that it is ready to receive requests.
 6. Select the Tests, Test Groups, and Test Suites you want in CI and run them
with `inferno execute`. See
[Running a Test Kit in Command Line](/docs/getting-started/inferno-cli.html#simple-execution)
for more information. The command will exit with status 0 if the Inferno Summarizer deems
it a pass.
    + You can run multiple inferno execute commands, but remember that each call represents
its own test session.
    + Since TLS cannot always be emulated in CI, you can add the environment variable
`INFERNO_DISABLE_TLS_TEST=true` to mark all TLS tests as omitted and may allow the
Test Suite to pass.
 7. Clean up. You can stop Inferno services with `bundle exec inferno services stop`.

To see an example of these steps, see [this Github workflow file](https://github.com/inferno-framework/inferno-reference-server/blob/5e0d06ad5414efa93499fd3de093e29cf5e6d9d1/.github/workflows/inferno_ci.yml)
which is used to test the Inferno Reference Server against the (g)(10) certification test kit.
