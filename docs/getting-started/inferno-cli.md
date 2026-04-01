---
title: Inferno CLI
nav_order: 2
parent: Getting Started
section: docs
layout: docs
---
{:toc-skip: .h3 data-toc-skip=""}

# Inferno Command Line Interface

The Inferno Command Line Interface is available to developers running Inferno with a local Ruby installation.

## Inferno Commands

All commands (unless stated below) must be prefixed with `bundle exec` (e.g. `bundle exec inferno migrate`) because
it guarantees that only the exact dependencies listed in `Gemfile.lock` are used.

The commands available include:

| Command      | Description |
|--------------|-------------|
| `inferno console` | Starts an interactive console session with Inferno. More information can be found on the [Debugging Page](debugging.html#interactive-console). |
| `inferno execute` | Execute tests in the command line. |
| `inferno execute_script` | Execute tests in the command line instead of web UI. |
| `inferno evaluate IG_PATH [--options]` | Run the FHIR evaluator in the command line. Does not require `bundle exec`. |
| `inferno help [COMMAND]` | Describes the available commands, or one specific command if specified. |
| `inferno migrate` | Runs database migrations. |
| `inferno new TEST_KIT_NAME` | Create a new test kit. Run `inferno new --help` for additional options. Does not require `bundle exec`. |
| `inferno requirements SUBCOMMAND [...ARGS]` | Manipulates and checks Inferno requirements. The available subcommands are `export_csv`, `check`, `coverage`, and `check_coverage`. See the [requirements page](/docs/advanced-test-features/requirements) for details of these subcommands. |
| `inferno requirements help SUBCOMMAND` | View details on the requirements subcommands. |
| `inferno services start` | Starts the background services (nginx, Redis, etc.) for Inferno. |
| `inferno services stop` | Stops the background services for Inferno. |
| `inferno session SUBCOMMAND [...ARGS]` | Manages Inferno test sessions. The available subcommands are `create`, `start_run`, `status`, `cancel_run`, `data`, `results`, and `compare`. |
| `inferno session help SUBCOMMAND` | View details on the session subcommands. |
| `inferno start` | Starts Inferno web UI. Do not use `bundle exec` if the Inferno Core version is prior to 0.4.39. |
| `inferno suite SUBCOMMAND [...ARGS]` | Performs suite-based operations. The available subcommands are `describe`, `help`, `input_template`, and `lock_short_ids`.|
| `inferno suite help SUBCOMMAND` | View details on the suite subcommands. |
| `inferno suites` | Lists available test suites. |
| `inferno version` | Outputs the version of Inferno Core (not the Test Kit). Does not require `bundle exec`. |
{: .grid.command-table}

## Creating a new Test Kit

The `inferno new` command allows you to create a new instance of an Inferno Test
Kit. This command provides options to specify the names of authors, and load
required implementation guides locally or from external websites. This will set
the names of the test folder and Ruby file in the `lib` folder to match the name
of the test kit, and set the name of the main module. It will also download
the `package.tgz` file for the specified Implementation Guide(s).

This method can be more convenient than manually cloning the
[Inferno Template](https://github.com/inferno-framework/inferno-template) repository, as it automatically sets the names of files and folders to match the Test Kit name.
It will automatically install the necessary Gem files used by Inferno Core and run the
database migrations to bring the database up to date. Run `inferno new --help` for more
options and examples.

```
inferno new MyTestKit --author "My Name" --author "My Friend" --implementation-guide hl7.fhir.us.core@6.1.0
```

Note that this command follows the naming convention used by Ruby gems. The command
`inferno new MyTestKit` will create a new folder named `my-test-kit`. Inside the
`my-test-kit/lib` folder, it will create the subdirectory `my_test_kit` for your test files,
and the main Ruby file named `my_test_kit.rb`. The main module in the `.rb` file will be named `MyTestKit`.

The new test kit supports [RSpec](https://rspec.info/) testing on the test kit itself. It also includes a working example in `my-test-kit/spec/patient_group_spec.rb`.

It will create a `my_test_kit.gemspec` file, and set the names of any authors supplied
using the `-a` option, and set the name, summary and description values to your Test Kit name.
You should manually inspect this file if you want to [publish or distribute the Test Kit](/docs/distributing-tests.html).

The `--implementation-guide` or `-i` option will look at an absolute file path if its prefixed by `file:///` or lookup the name in the [official FHIR package registry](https://packages.fhir.org/).

## Manage Sessions

The `inferno session` command provides a programmatic interface for creating and managing
Inferno test sessions from the command line. It is useful for automating test execution,
especially in CI/CD pipelines. See the [CI/CD Usage](docs/ci-cd-usage) page for additional
information and tools for the CI/CD use case.

All commands leverage the [JSON web API](https://inferno-framework.github.io/inferno-core/api-docs/)
to interact with Inferno. By default, these commands interact with the
local running Inferno instance. Additionally, all session subcommands
support the `--inferno_base_url` (`-I`) option to specify the URL of a remote running Inferno
instance to interact with instead. All commands write JSON to stdout and exit `0` on success or
`3` on error (`1` and `2` are reserved for Thor and Bash respectively).

Subcommands include:

- **`create SUITE_ID`**

  Create a new test session for the given suite.

  **Options**:
  - `-I`, `--inferno_base_url`: URL of the target Inferno service.
  - `-o`, `--suite_options`: Suite options as `key:value` pairs (e.g.,
    `--suite_options us_core_version:us_core_6 smart_app_launch_version:smart_app_launch_2`).
    Keys and values can use either the display name seen in the Inferno UI or the internal name.
  - `-p`, `--preset`: Apply a named preset when creating the session. Both the title or the id
    can be used to identity the target preset.

  **Output**: JSON representation of the created session, including the session `id` used by all subsequent subcommands.
    See the output of the [`POST /test_sessions`](https://inferno-framework.github.io/inferno-core/api-docs/#/Test%20Session/post_test_sessions) API for details on the output.

  ```sh
  bundle exec inferno session create my_test_suite -I https://inferno.healthit.gov/suites -p my_preset
  ```

- **`start_run SESSION_ID`**

  Initiate a test run on an existing session.

  **Options**:
  - `-I`, `--inferno_base_url`: URL of the target Inferno service.
  - `-r`, `--runnable`: Short or internal ID of a specific group or test to run.
    If omitted, the entire suite is run.
  - `-i`, `--inputs`: Input values as `key:value` pairs (e.g., 
    `--inputs url:https://example.com patient_id:123`). These merge with and override
    the session's previously stored inputs. The internal name for the input must be used
    as the key. This can be found from the [Inferno testing interface UI](docs/user-interface#main-test-interface) by looking at the json or yaml representation of
    the inputs.

  **Output**: JSON representation of the created test run. See the output of the [`POST /test_runs`](https://inferno-framework.github.io/inferno-core/api-docs/#/Test%20Run/post_test_runs) API for details on the output.

  ```sh
  bundle exec inferno session start_run 7uLiz9qX4og -I https://inferno.healthit.gov/suites -r my_group \
    -i url:https://example.com patient_id:123
  ```

- **`status SESSION_ID`**

  Get the current run status of a session.

  **Options**:
  - `-I`, `--inferno_base_url`: URL of the target Inferno service.

  **Output**: JSON including a `status` field (`created`, `queued`, `running`, `waiting`, `done`,
  etc.) and the ID of the `last_test_executed`. See the output of the 
  [`GET /test_runs/{test_run_id}`](https://inferno-framework.github.io/inferno-core/api-docs/#/Test%20Run/get_test_runs__test_run_id_)
  API for details on the output. Additionally, When `status` is `waiting`, fields
  `wait_outputs` and `wait_result_message` are added to this base object using the
  `outputs` and `result_message` fields from the result of the waiting test (last test that was executed)
  which can be used to script the continuation of the session.

  ```sh
  bundle exec inferno session status 7uLiz9qX4og -I https://inferno.healthit.gov/suites
  ```

- **`cancel_run SESSION_ID`**

  Cancel the currently active run for a session. Applies when the run is in `queued`,
  `running`, or `waiting` status. 

  **Options**:
  - `-I`, `--inferno_base_url`: URL of the target Inferno service.

  **Output**: JSON with `run_id` and `cancelled: true`, or an error object if no cancellable
  run is active.

  ```sh
  bundle exec inferno session cancel_run 7uLiz9qX4og -I https://inferno.healthit.gov/suites
  ```

- **`data SESSION_ID`**

  Get the input values currently stored for a session.

  **Options**:
  - `-I`, `--inferno_base_url`: URL of the target Inferno service.

  **Output**: JSON array of objects with `name` and `value` keys representing the session's current inputs.
    See the output of the [`GET /test_sessions/{test_session_id}/results`](https://inferno-framework.github.io/inferno-core/api-docs/#/Result/get_test_sessions__test_session_id__results)
    API for details on the output.

  ```sh
  bundle exec inferno session data 7uLiz9qX4og -I https://inferno.healthit.gov/suites
  ```

- **`results SESSION_ID`**

  Get the test results for a session.

  **Options**:
  - `-I`, `--inferno_base_url`: URL of the target Inferno service.

  **Output**: JSON array of result objects for each test, group, or suite that has been executed. 
    See the output of the [`GET /test_sessions/{test_session_id}/session_data`](https://inferno-framework.github.io/inferno-core/api-docs/#/Session%20Data/get_test_sessions__test_session_id__session_data)
    API for details on the output.

  ```sh
  bundle exec inferno session results 7uLiz9qX4og -I https://inferno.healthit.gov/suites
  ```

- **`compare SESSION_ID`**

  Compare a session's results against expected results from a file or another session.
  Exits `0` when results match; exits `3` when they do not.

  **Options**:
  - `-I`, `--inferno_base_url`: URL of the target Inferno service.
  - `-f`, `--expected_results_file`: Path to a JSON file containing the expected results.
  - `-s`, `--expected_results_session`: Session ID on the same server whose results serve as expected.
  - `-m`, `--compare_messages`: Also compare per-test messages (not only pass/fail result). Default: `false`.
  - `-r`, `--compare_result_message`: Also compare each test's `result_message` string. Default: `false`.
  - `-n`, `--normalized_strings`: List of literal strings and regexes which will be used to normalize
    strings prior to comparison. For literal strings, the URL-encoded version will be replaced as well.

  **Output**: JSON with a top-level `matched` boolean and a `results` array. Each entry
  contains `id`, `type` (`Compared` / `Missing` / `Additional`), `matched`,
  `expected_result`, and `actual_result`. When `-m` or `-r` are set, the corresponding
  message fields are included as well.

  When `-f` is provided and results do not match, two files are written to the same
  directory as the expected results file. If the provided file name ends with
  `expected.json`, the `<prefix>` will be everything before that. Otherwise, it will be empty:
  - `<prefix>actual_results_<timestamp>.json` — the session's actual results
  - `<prefix>compared_results_<timestamp>.csv` — a CSV diff of the mismatched results

  ```sh
  bundle exec inferno session compare 7uLiz9qX4og -I https://inferno.healthit.gov/suites -f expected.json -m -n
  ```

## Running a Test Kit in Command Line

Inferno provides two CLI options for executing Inferno tests via the command line:
1. The `inferno execute_script` CLI command for complex executions that can involve multiple runs
   and sessions as well as scripting of external systems.
2. The `inferno execute` CLI command for simple executions that don't involve any interaction beyond
   starting the test runs.

### Complex Scripted Execution

The `inferno execute_script` CLI command can be used to execute complex Inferno runs from the command line
which are specified in a [script configuration file](/docs/advanced-test-features/scripting-execution#creating-script-configuration-files).
By default, scripts are executed against the local running Inferno instance (both background services
and the test kit must be running). Execution can be performed against a remote Inferno instance by providing
the root Inferno url using the `-I` option.

For example, the following command would run the script defined in file `g10.yaml` on the instance of
Inferno deployed to [inferno.healthit.gov](https://inferno.healthit.gov/suites):
```
bundle exec inferno execute_script g10.yaml -I https://inferno.healthit.gov/suites
```

See [Scripting Suite Execution](/docs/advanced-test-features/scripting-execution) for details on how to
define script configuration files and [CI / CD Usage](/docs/ci-cd-usage) for how to integrate scripts
into development pipelines.

### Simple Execution

The `inferno execute` command allows you to execute [runnables](https://inferno-framework.github.io/docs/writing-tests/#test-suite-structure)
from a Test Kit in the shell. The command requires:
 - The Test Kit as the working directory.
 - Inferno background services running.
 - A Test Suite id.
 - All inputs and any [Suite Options](https://inferno-framework.github.io/docs/advanced-test-features/test-configuration.html#suite-options) necessary for execution.
 - Optionally, the short ids of select Tests and Test Groups you want to run.

For example, to run the [US Core Test Kit](https://github.com/inferno-framework/us-core-test-kit)
v3.1.1 Single Patient API group, you would:

1. clone the repository
2. launch the background services with `bundle exec inferno services start`
3. run the following command

```
bundle exec inferno execute --suite us_core_v311 \
                            --suite-options smart_app_launch_version:smart_app_launch_1 \
                            --groups 2 \
                            --inputs "url:https://inferno.healthit.gov/reference-server/r4" \
                                     patient_ids:85,355 \
                                     "smart_credentials:{\"access_token\":\"SAMPLE_TOKEN\"}"
```

To view Test Suite ids you can run `bundle exec inferno suites`. Test Group short ids
and input names are available in the web UI. Suite Option ids and values, if present
in your Test Kit, can be found in its source code by searching for `suite_option` in the DSL.

The inferno execute command also allows you to execute one or more specific Tests.
For example, in inferno_core's dev_validator suite you can run exactly two tests via:

```
bundle exec inferno execute --suite dev_validator --tests 1.01 1.02 --inputs "url:https://hapi.fhir.org/baseR4" patient_id:1234321
```

You can even combine and repeat Tests and Test Groups by doing:

```
bundle exec inferno execute --suite dev_validator --short-ids 1 1.01 --inputs "url:https://hapi.fhir.org/baseR4" patient_id:1234321
```

which means run all Tests under Test Group 1, and after that re-run Test 1.01. Each
call to `inferno execute` represents one test session, and each short id reflects
one test run. If short ids are omitted then the entire Test Suite will be executed.
You can run

```
bundle exec inferno execute --help
```

for more information.

The `execute` command does not support SMART launch tests or tests that receive client requests
via CLI execution. Use the [`execute_script`](#complex-scripted-execution) functionality
for these complex execution cases. Some tests are also expected to
[run as a group](https://inferno-framework.github.io/docs/writing-tests/properties.html#run-as-group),
and may error or fail erroneously when run individually through CLI.

## Suite Subcommands

You can use the `inferno suite` command to interact with test suites more granularly.

- **`describe SUITE_ID`**

  Displays a suite's description and available suite options.

  ```sh
  bundle exec inferno suite describe us_core_v311
  ```

- **`input_template SUITE_ID`**

  Generates a JSON template for creating an input preset for a Test Suite.

  **Options**:
  - `-f`, `--filename <filename>`: Write the preset template to a specific file.

  ```sh
  bundle exec inferno suite input_template us_core_v311 -f template.json
  ```

  The file may also include embedded Ruby (`.json.erb`) for dynamic content.

  ```sh
  bundle exec inferno suite input_template us_core_v311 -f template.json.erb
  ```

- **`lock_short_ids SUITE_ID`**

  Loads the given suite and writes its current short_id map to its corresponding YAML file.

  Short IDs are numeric identifiers displayed in the left side of the Inferno UI, before short title. By default, Inferno auto-generates these based on test order.

  Locking short IDs ensures that test short IDs remain consistent, even when tests are added, removed, or reordered.

  This is especially useful for certification test kits, like [ONC Certification (g)(10) Standardized API Test Kit](https://github.com/onc-healthit/onc-certification-g10-test-kit), where maintaining stable short IDs is important for usability and traceability.

  The short ID map is written to: `./lib/<test_kit_name>/<suite_name>_short_id_map.yml`

   **Example usage (from the ONC Certification (g)(10) Standardized API Test Kit):**

  ```sh
  bundle exec inferno suite lock_short_ids 'g10_certification'
  ```

  This will persist the current short ID mapping to: `./lib/onc_certification_g10_test_kit/g10_certification_suite_short_id_map.yml`.

  > **Note**: If a test kit uses locked short IDs, the developer must execute this command whenever tests are added or removed to keep the short ID map up to date.

## Run the FHIR Evaluator

The Evaluator is a command-line tool that characterizes and analyzes HL7® FHIR® data in the context of a given Implementation Guide. The Evaluator is primarily designed to help ensure example datasets are comprehensive and useful.

Run the evaluation CLI with the command below:

```
inferno evaluate [-d data_path] ig_path
```

Options:

- `-d`, `--data-path`: Specify a path to example FHIR data. If not provided, examples embedded in the IG will be used.
- `-o`, `--output`: Output result as an OperationOutcome to the specified file (e.g., `outcome.json`).
- `-c`, `--config`: Use a custom YAML config file to evaluate the data.

**Examples:**

Load the US Core IG and evaluate the data in the provided example folder. If there are examples in the IG already, they will be ignored.

```
inferno evaluate -d ./package/example ./uscore7.0.0.tgz
```

Loads the US Core IG and evaluate the data included in the IG's example folder.

```
inferno evaluate ./uscore7.0.0.tgz
```

Export results as an OperationOutcome to a file:

```
inferno evaluate ./uscore7.0.0.tgz --output outcome.json
```

Use a custom configuration file:

```
inferno evaluate ./uscore7.0.0.tgz --config ./my_config.yml
```
