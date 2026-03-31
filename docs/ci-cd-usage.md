---
title: CI/CD Usage
nav_order: 26
layout: docs
section: docs
---

# Using Test Kits in CI/CD

Inferno provides two CLI options for executing Inferno tests via the command line:
1. The `inferno execute` CLI command for execution of a single suite, group, or test.
2. The `inferno execute_script` CLI command for more complex executions that can involve multiple runs
   and sessions as well as scripting of external systems.

## Using the `inferno execute` CLI for Simple Execution

To run Inferno using the [inferno
execute](/docs/getting-started/inferno-cli.html#running-a-test-kit-in-command-line)
CLI command, follow these steps:

 1. Setup a container or environment with Ruby and Docker
 2. Obtain your target Test Kit version and make it your working directory
 3. Launch background Inferno services: `bundle exec inferno services start`. This
command works on top of docker compose and daemonizes the processes for you.
 4. Confirm that background services are ready, possibly with the [wait-for](https://github.com/eficode/wait-for) script.
 5. Launch the system under test and confirm that it is ready to receive requests.
 6. Select the Tests, Test Groups, and Test Suites you want in CI and run them
with `inferno execute`. See
[Running a Test Kit in Command Line](/docs/getting-started/inferno-cli.html#running-a-test-kit-in-command-line)
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

## Using the `inferno execute_script` CLI for Complex Orchestration

The `inferno execute` command covers straightforward single-run scenarios. However many
Test Suites require more complex orchestration to execute completely. 
For example, some suites pause in a `waiting` state until an external action is performed.

For these and other complex cases that require coordination, Inferno provides the `inferno execute_script` CLI command,
which runs a Bash orchestration library available in the [inferno-core repository](https://github.com/inferno-framework/inferno-core/blob/main/execution_scripts/session_runner.sh).
This script leverages the [`inferno session` CLI commands](/docs/getting-started/inferno-cli.html#manage-sessions)
to create, manage, and compare session results. Users define a [configuration file](#yaml-configuration-format)
that tells the runner when and how to perform execution steps inside and outside of Inferno.

### Prerequisites

To run the `inferno execute_script` CLI command, the following utilities must be available to execute:

- `bash` (v4+)
- [`jq`](https://stedolan.github.io/jq/)
- [`yq`](https://github.com/mikefarah/yq) (v4+)

Additional utilities may be needed to execute commands found in [execution configuration files](#yaml-configuration-format).

Additionally, the command requires a running instance (local or remote) of the target Inferno Test Kit(s)
and their services.

### Execution

For basic execution via the command line, the CLI command takes the target [execution configuration file](#yaml-configuration-format) as an input.

```
bundle exec inferno execute_script path/to/script_config_file.yaml
```

By default, the execution targets the local running instance of Inferno, which must be up. A remote Inferno
instance can be targeted by passing the `-I` option with the url of the target running Inferno instance,
e.g., the public Inferno instance at `https://inferno.healthit.gov/suites`.

#### Github Workflow Execution

Inferno provides a standard Github Workflow file that finds script configuration files
defined under the `execution_scripts` directory and runs each of them against a freshly
created Inferno instance running the test kit defined in the repository.

#### Environment Variables

The following environment variables control specific script behavior and can be set prior to executing the
`inferno execute_script` command:

| Variable | Default | Description |
|---|---|---|
| `POLL_INTERVAL` | `5` | Seconds between status checks while a run is active |
| `DEFAULT_POLL_TIMEOUT` | `30` | Default timeout in seconds for each polling step |
| `COMPARE_NORMALIZE` | `true` | Normalize UUIDs and base64 values before comparing results (`-n`) |
| `COMPARE_MESSAGES` | `true` | Include the `messages` array in result comparison (`-m`) |
| `COMPARE_RESULT_MESSAGE` | `true` | Include `result_message` in result comparison (`-r`) |
| `ACTIONS_FILE` | _(derived from script path)_ | Override the YAML config file path when sourcing the script as a library |

#### Example Scripts to Execute

The following Test Kits include scripts that can be executed. To execute any of them
1. Checkout the repository locally and set it up to be run in developer mode
2. Locate the target script configuration file under the `execution_scripts` directory
   and run `bundle exec inferno execute_script execution_scripts/path/to/script_config_file.yaml` pointing to the desired configuration file.

- [**Inferno Template**](https://github.com/inferno-framework/inferno-template): 
  New Inferno Test Kits created from the [inferno-template repository](https://github.com/inferno-framework/inferno-template)
  or the [`inferno new` CLI command](/docs/getting-started/inferno-cli.html#inferno-commands)
  include a simple execution configuration file for the example test suite included in the
  template.
- [**Inferno Core**](): TODO
- [**(g)(10) Certification**](): TODO
- [**DaVinci PAS**](): TODO

### Creating Script Configuration Files

Script configuration files define two things
- The Inferno session(s) executed, including any suite options or presets to be used
- The individual steps to take including
  - When to take the step in the form of an Inferno session status and last executed test.
  - What action to take in the form of an Inferno `session start_run` CLI command or general shell command.

#### Process

Execution scripts are typically used to automate how a user would interact with the Inferno
UI. Starting from a UI execution makes planning the sessions and steps of an execution
script simple. When mapping a UI execution onto a execution script, each session created
(typically one, sometimes two if running Inferno suites against each other) will correspond
to a `sessions` entry, and each interaction with the Inferno UI (to start a test run, or respond
to a wait dialog) will correspond with a `steps` entry.

The tricky piece is to determine the specific values to put in the script configuration file for internal
identifiers like
- suite option keys and values
- input keys and values
- test full ids for use in specifying the last test


To use the script and the workflow, 
1. Create a YAML config file (see format below) in the `execution_script/`
   directory.
2. Make sure that the containing test kit is running in Ruby developer mode, including
   both the background services and the test kit itself.
3. From the root test kit directory, run the script

```bash
bash execution_scripts/session_runner.sh execution_scripts/my_suite.yaml
```

4. The script will print to the terminal details on its execution, including matched
   test states and executed actions. If the test reaches an unmatched state or never
   reaches an `END_SCRIPT` action, it will fail, providing details on the issue so
   that updates can be made to fix the problem.
5. Once the script completes for the first time, unless you manually defined an expected result
   file (`my_suite_expected.yaml`), the command will generate the expected file based on 
   the results of the executed session. Review the results to ensure that they represent
   the expected results. If they don't adjust the script yaml file to correct any issues.
6. Run the script once more locally to make sure that the results of the next run match
   the expected. If they don't there may be non-deterministic behavior or other problematic
   details in you test kit (see debugging details below).
7. Commit the script yaml file and the expected results json file to the test kit repository
   and now the execution will be checked whenever changes are made to the test kit.

#### YAML Configuration Format

The config file has two top-level keys: `sessions` and `steps`.

```yaml
sessions:
  - suite_id: my_suite                 # required
    name: my_session                   # optional; used to reference this session in step/tokens
    preset_id: my-preset               # optional
    suite_options:                     # optional
      option_key: option_value
    expected_results_file: expected.json  # optional; relative to the yaml file
                                          # default: <yaml_name>_expected.json

steps:                                 # ordered; first matching step wins
  - status: done                       # session status to match: created, done, or waiting
    last_test: my_suite-Group01-Test01 # optional; full id of the last test executed (exact match)
                                       #   must be present unless the status is created, in which case it must be absent
    session: my_session                # optional; in multi-session runs, scopes step to this session
    start_run:                         # structured alternative to 'command' for inferno session start_run calls
      runnable: "1.01"                 # optional; short_id or full id of the group/test to run (-r flag)
      inputs:                          # optional; key/value map of inputs (-i flag)
        input_name: "value"
    timeout: 300                       # optional; seconds before polling this step times out. If not provided
                                       #  falls back to the session_runner.sh default (30s or the value of the 
                                       #  DEFAULT_POLL_TIMEOUT environment variable)
    next_poll_session: other_session   # optional; switch polling focus to the named session after action
    state_description: "..."           # optional; logged when the step is matched
    action_description: "..."          # optional; logged when the step is matched
```

Each step must have either a `start_run:` block or a `command:` string (see below).

#### Step: `command` vs `start_run`

Use `start_run:` when you want to launch a test run using the standard
`bundle exec inferno session start_run` command. For anything else (e.g. making an
external HTTP request, running a shell command, or passing data to a waiting test),
use the `command:` string field. The `command` string is evaluated by `eval`, so
full shell expressions are supported.

```yaml
steps:
  # Start a run using the structured start_run block
  - status: created
    start_run:
      runnable: "1"
      inputs:
        url: "https://example.com/fhir"

  # Start a run using a raw command string
  - status: done
    last_test: my_suite-Group01-Test01
    command: "bundle exec inferno session start_run '{session_id}' -r 2"

  # Perform an external action to satisfy a waiting test
  - status: waiting
    last_test: my_suite-Group01-wait_test
    command: "curl -s '{wait_outputs.redirect_url}'"

  # Execute a defined ruby script
  - status: waiting
    last_test: my_suite-Group01-launch_test
    command: "bundle exec ruby execution_scripts/launch_helper.rb {wait_output.launch_url}"
```

### Template Tokens

Template tokens in `command` strings (and `start_run` input values) are substituted
at runtime:

| Token | Description |
|---|---|
| `{session_id}` | ID of the current session (single-session only) |
| `{session_id.NAME}` | ID of the session with the given name (required in multi-session) |
| `{result_message}` | The wait result message from the current session |
| `{NAME.result_message}` | Wait result message from the named session (triggers a status fetch) |
| `{wait_outputs.KEY}` | Value of the named wait output from the current session |
| `{NAME.wait_outputs.KEY}` | Named wait output from a different session (triggers a status fetch) |

### Special `command` Values

| Value | Behaviour |
|---|---|
| `END_SCRIPT` | Stop execution for this session and proceed to result comparison |
| `NOOP` | Match the step but take no action; keep polling with the current timeout |

### Automatic Status Handling

You do not need steps for every possible status. The script applies these defaults
automatically:

| Status | Default behaviour |
|---|---|
| `running`, `queued`, `cancelling` | Poll again |
| `done` (no step matched) | Warn, run result comparison, exit non-zero |
| `waiting` (no step matched) | Cancel the current run and resume polling |
| `created` (no step matched) | Warn, run result comparison, exit non-zero |

### Expected Results

After all runs complete, the script compares results against an expected results JSON
file. If the file does not yet exist, the current results are written to it, creating
a baseline for future runs. The expected file path is resolved as follows:

- If `expected_results_file` is set in the YAML, that path is used (relative to the
  YAML file).
- For single-session configs with no explicit path: `<yaml_name>_expected.json`.
- For multi-session configs with no explicit path: `<yaml_name>_<session_name>_expected.json`.

### Multi-Session Example

Some test flows require two sessions to run in parallel — for example, a client test
that makes requests to a server session. Use multiple entries under `sessions:` and
scope steps with `session:` and `next_poll_session:` to coordinate between them.

```yaml
sessions:
  - suite_id: my_server_suite
    name: server
  - suite_id: my_client_suite
    name: client

steps:
  # Start the server session first
  - status: created
    session: server
    start_run:

  # Once server is waiting, start the client session
  - status: waiting
    session: server
    next_poll_session: client
    command: "NOOP"

  - status: created
    session: client
    start_run:
      inputs:
        server_url: "https://example.com"

  # When client is done, resume the server
  - status: waiting
    session: client
    next_poll_session: server
    command: "curl -s '{wait_outputs.redirect_url}'"

  - status: done
    session: server
    command: "END_SCRIPT"
```