---
title: Scripting Suite Execution
nav_order: 9
parent: Advanced Features
layout: docs
section: docs
---
# Scripting Suite Execution

## Overview

Inferno supports the scripting of test suite execution through the `inferno execute_script`
[CLI command](/docs/getting-started/inferno-cli#complex-scripted-execution). This command takes as input a
[configuration file](#creating-script-configuration-files) that tells Inferno when and how to perform
execution steps both inside and outside of Inferno. The results of the session are compared
against the results of a known-good execution to identify any regressions. The script
can be executed against the local Inferno instance or a specific remote instance. These scripts
can be built into [CI/CD Pipelines](/docs/ci-cd-usage#using-the-inferno-execute_script-cli-for-complex-orchestration).

## Execution

Three standard options for executing scripts include:
- Executing a specific script using the `execute_script` CLI: See the [CLI documentation](/docs/getting-started/inferno-cli#complex-scripted-execution)
  for details on the command.
- Executing scripts defined in the test kit's `execution_scripts` directory using
  the `bundle exec rake execute_scripts:run_all` command. Two environment variables may be set in addition:
  - `INFERNO_BASE_URL=<inferno_host>`: set to run the scripts against a specific Inferno host.
    If not provided, then the local Inferno host will be used.
  - `FILTER=execution_scripts/<directory>/*.yaml`: provide a different filter to use to identify
    the scripts to execute. If not provided, the default is `execution_scripts/**/*.yaml`.
- Executing all scripts defined in the test kit's `execution_scripts` directory within GitHub,
  either in response to a commit or a manual trigger. See 
  [CI / CD Usage](/docs/ci-cd-usage#using-the-inferno-execute_script-cli-for-complex-orchestration)
  for additional details.

### Execution Process and Output

When a script is executed, the following phases are performed:
1. Sessions are created
2. Steps are executed
3. Results are checked

During execution, Inferno will print to the terminal details on its polling, matching, and actions during
execution and provide a summary of the results comparison performed.

Inferno will use exit code 3 when an error is encountered. Error cases include:
- The exepected results file for one or more sessions did not exist.
- Compared results for one or more sessions did not match.
- Script execution did not end at the `END_SCRIPT` step.
- Script execution had to be interrupted due to a timeout.

Otherwise, the CLI command will end with exit code 0 indicating success.

#### Session Creation

Test suite sessions for the execution are detailed in the [`sessions`](#sessions) section of the script
configuration file. Creation is performed using the
[`inferno session create` CLI](/docs/getting-started/inferno-cli#manage-sessions).

#### Step Execution

The steps taken during execution are detailed in the [`steps`](#steps) section of the script
configuration file.

Inferno checks the status of sessions for next step polling using the [`inferno session status` CLI](/docs/getting-started/inferno-cli#manage-sessions). It may also use the [`inferno session cancel` CLI](/docs/getting-started/inferno-cli#manage-sessions) if it needs to cancel a session.

To start runs, Inferno uses the [`inferno session start_run` CLI](/docs/getting-started/inferno-cli#manage-sessions).

#### Check Results

For each session in the script, Inferno will compare the results in the expected results
file (see [Expected Results File and Alternates](#expected-results-file-and-alternates))
to the results of the completed session execution. Configuration of the comparison is
detailed in the [`comparison_config`](#result-comparison-config) section of the script
configuration file.

Comparison is performed using the [`inferno session compare` CLI](/docs/getting-started/inferno-cli#manage-sessions)
using the `-f` flag to specify the expected file. Comparison involves the following steps:
- normalize the expected and actual results using the configured [`normalized_strings`](#normalized-strings)
- match individual result entries using the runnable id (`test_id`, `test_group_id`, or `test_suite_id`)
- compare the matched result entries, looking at the status (e.g., pass, fail), the result message, and the
  individual messages within the result

When the actual and expected results do not match, two files will be written in the same location as the expected file:
- actual results: a file with the results json (prior to normalization)
- comparison analysis: a csv file with details of results that differed, including normalized details
These files are named using the same prefix as the executed file and include a timestamp for the execution so that
they will be unique for each script execution.

When the target expected results file does not exist it will be created using the output of the
[`inferno session results` CLI](/docs/getting-started/inferno-cli#manage-sessions). The `execute_script`
CLI will exit with an error status in this case. After creation of a expected results
file in this way, users should review the results using the file and/or the Inferno
UI to make sure that they are the expected results as subsequent script executions
will perform the comparison using that file as the expected results.

## Creating Script Configuration Files

At a high-level, the script configuration file contains instructions for
- The session(s) to create, including any suite options and presets to use
- The steps to take to execute the script, each including an action, when to perform it,
  and which session will act next if there are multiple Inferno sessions involved.
- Normalizations of the results to make sure that executions are comparable across runs
  and Inferno instances.

The easiest way to think about creating a script configuration file is that it mirrors
the manual steps taken in the UI to execute an Inferno test session of a particular suite
against a specific system. Go through the manual execution steps and note each time there
is an interaction with the Inferno UI or a state in Inferno that triggers an interaction
with the tested system: each of these will become a step within the script.

The rest of this section provides details on how to turn the manual execution into a script file.
See the documentation at the top of the [`execute_script.rb`](https://github.com/inferno-framework/inferno-core/blob/main/lib/inferno/apps/cli/execute_script.rb)
file for a complete format reference.

### Sessions

Each script configuration file will indicate a list (sequence) of one or more Inferno sessions to create under
the `sessions:` top-level key. Each sequence includes
- **Suite** (`suite:`): *Required* - the internal id for the suite or the title selected in the UI.
- **Name** (`name:`): *Conditional* - a short key used to identify the session in steps.
  Required when multiple sessions are defined, otherwise optional.
- **Preset** (`preset:`): *Optional* - the internal id or title of a preset to use for the session.
- **Suite Options** (`suite_options:`): *Optional* - pairs of `key: value` entries each corresponding to a suite
  option. The key can be either the internal id or the title from the UI. The value can be either
  the internal value or the label from the UI.

### Result Comparison Config

After completing the script, the results of the executed session will be compared for each
session to the expected results recorded in the session's expected results file. Because
direct comparison of results from different runs across different systems (e.g., local vs
deployed) will not always be directly comparable, two mechanisms are provided to tweak
the actual and/or expected results to facilitate like-to-like comparison.

All configurations around results comparison are nested under the `comparison_config:` top-level
key.

#### Normalized Strings

Before comparing the actual results to the expected results, Inferno will replace strings
indicated in the `normalized_strings:` key. This prevents these values, which are expected
to be different between runs and across different Inferno hosts, from triggering an execution
failure. Each entry in the sequence can be
- A raw string: the exact string and its URL-encoded form are replaced with the string `<NORMALIZED>`
- A raw regex: strings matching the regex are replaced with the string `<NORMALIZED>`
- An object with two keys that provides specific replacement strings (useful for debugging):
  - `patterns:` a sequence of strings or regexes used to identify the strings to replace,
    which behave like the raw forms. (for single-entry lists, the `pattern:` can be used
    instead with the single value)
  - `replacement:` the string that replaces the patterns (e.g., `<INFERNO_HOST>`)

For example, the following configuration normalizes, the inferno host, the reference server
url, pkce code challenges, and UUIDs, each with a specific replacement string
for ease of debugging.

```
comparison_config:
  normalized_strings:
    - replacement: <INFERNO_HOST>
      patterns:
        - http://localhost:4567/inferno # local inferno core ruby
        - http://localhost:4567 # local ruby
        - http://localhost # local docker
        - https://inferno.healthit.gov/suites # prod
        - https://inferno-qa.healthit.gov/suites # qa
    - replacement: <REFERENCE_SERVER_URL>
      patterns:
        - https://inferno.healthit.gov/reference-server # prod reference server
        - https://inferno-qa.healthit.gov/reference-server # qa reference server
    - replacement: code_challenge=<CODE_CHALLENGE>
      pattern: /code_challenge=[A-Za-z0-9+\/=_-]{43}/
    - replacement: <UUID>
      pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
```

#### Expected Results File and Alternates

When comparing results, Inferno first identifies the file that contains the expected
results. These are formatted as the output of the `session results` CLI command. Note
that Inferno will generate the target file the first time a script is run.

By default, the expected results file will be `<yaml basename>_expected.json`. For
example, for a script configuration file named `g10.yaml`, the default expected file
would be `g10_expected.json`. A different file to use as the default can be
specified in the `expected_results_file:` key. Inferno will interpret relative paths
as relative to the script configuration file's directory.

Some suites will expected differences between session results that go beyond string
normalizations. For example, suites that verify a server's TLS setup will fail
when evaluating a local server without TLS setup, which may be the expected result
when running in a CI/CD environment. For this situation, an alternate expected
results file can be indicated for certain executions. These are indicated under
the `alternate_expected_files:` key which will contain a list (sequence) of entries
each with the following keys:
- **Alternate File** (`file:`): *Required* - the file containing the expected results, relative
  to the script configuration file's directory.
- **Condition** (`when:`): *Required* - a list of conditions which must all match. Each condition
  contains keys for
  - **Target field** (`field:`): *Required* - the value to check. Can be one of
    - `inputs.<name>` to check the value of an input used during the session.
    - `configuration_messages` to check the `messages` field of entries (one must match)
      in `test_suite.configuration_messages`.
    - `inferno_base_url` to check the Inferno host.
  - **Match Criteria** (`matches:` or `not_matches`): *Required* - a regex to use to check the value(s)
    either match or don't match.

For example, the following configuration tells Inferno to use an alternate expected file
the expects terminology failures when
1. It isn't running on a public Inferno host, and
2. There is a configuration message indicating that there is a terminology build problem.

```
comparison_config:
  expected_results_file: g10_results_expected.json
  alternate_expected_files:
    - file: g10_no_terminology_expected.json
      when:
        - field: inferno_base_url
          not_matches: inferno(-qa)?\.healthit\.gov
        - field: configuration_messages
          matches: ^There is a problem with the terminology resources
```

If there are multiple matching `alternate_expected_file:` entries, the one listed first will be used.

When there are multiple sessions defined, both the `expected_results_file:` and `alternate_expected_files:`
keys must be nested under a `sessions:` object with keys corresponding to the session name. If the
above example was in a multi-session script associated with the session named `g10`, it would
look like this:

```
comparison_config:
  sessions:
    g10:
      expected_results_file: g10_results_expected.json
      alternate_expected_files:
        - file: g10_no_terminology_expected.json
          when:
            - field: inferno_base_url
              not_matches: inferno(-qa)?\.healthit\.gov
            - field: configuration_messages
              matches: ^There is a problem with the terminology resources
```

Note that the `normalized_string:` key never appears under the `sessions:` key.

### Steps

Each script configuration file will indicate a list (sequence) of steps that are taken by the script under
the `steps:` top-level key. There will be at least 2 in every script:
- an initial `created` state that will be the first step executed.
- a final `END_SCRIPT` action that will be the last step executed.

While steps are executed when they are matched by Inferno's state, only one step is executed at a time
and loops are detected and not allowed. By convention, steps should be listed in the order they will
be executed during script execution.

Each step consists of keys pertaining to the following details
- When to take the step
- What action to take
- How to look for the next step

The following subsections detail the keys related to each of these areas

#### When to take the step

Each step indicates when it will be take through three keys
- `status:` *Required* - specifies the status to match with options:
  - `done` when a test run has completed
  - `waiting` when a test run is in progress but waiting for external input
  - `created` when a test session has been created, but no runs started yet
- `last_completed:` *Conditional* - specifies a runnable in the form of an
  internal id or short numeric id from the UI. 
  - for `done`, will be the test, group, or suite that was executed when the run was started
  - for `waiting`, will be the test that initiated the wait
  - for `created`, will be omitted (nothing executed yet)
- `session:` *Conditional* - when multiple sessions, the name (not suite id) of the
  session to match on, otherwise omitted.

Additionally, the optional `state_description:` key can be used to provide documentation
describing the state. This has no functional effect, but is echoed during script execution
for debugging purposes.

Note that Inferno can be have other status (e.g., `running` and `cancelling`), but these
do not represent stable states where Inferno is waiting for an action, so they will never
be used in scripts.

Conversely, Inferno needs to know what to do in any stable state that is reached. If no
step matches a `done` or `created` state that Inferno reaches, then the script will end
with an error (results not checked). If no step matches a `waiting` state, then Inferno
will cancel the current run (ending the wait) and attempt to continue with the next
matching `done` state.

#### What action to take

There are three kinds of actions that can be take by a step each specified by a different
key. Only one can be defined for each step:
- `start_run:` Used to execute an Inferno test, group, or suite on one of the sessions
  started by this script. The following sub keys are used.
  - `runnable:` *Required* - the test, group, or suite to execute, specified as a short ID
    from the UI or an internal id.
  - `inputs:` *Optional* - key-value pairs indicating inputs to be merged into those already
    stored in the session (from the preset or previous run inputs or outputs). Each key must
    be the internal name for the input (from the UI, use the yaml or json view of the inputs
    to find the internal name).
  - `session:` *Conditional* - when multiple sessions are defined the name (not the suite)
    of the session on which the run will be executed, otherwise omitted.
- `command:` Specifies a shell command to execute. For example, a `curl` command to navigate
  to an attestation URL or an external script that automates manipulation of the tested system.
  See [these considerations](#defining-executing-and-securing-complex-commands)
  for creating, executing, and securing scripts with complex commands. 
- `action:` Script-specific actions to bridge between steps. Defined actions include:
  - `END_SCRIPT` used on the distinguished final step. The execution will end successfully
    after this step.
  - `NOOP` used on steps that don't require an action, but indicate that another step is
    unblocked. See details in the [discussion of multiple session scripts](#scripts-with-multiple-sessions)
    below.
  - `WAIT` used on transitory `waiting` states that are expected to end without external
    action. Note that unlike other actions, this one does not cause Inferno to break the
    polling loop, so it can be matched multiple times (not a loop) but does not change
    next step details (see the details on [finding the next step](#how-to-look-for-the-next-step)
    below).

The specifics of `start_run` and `command` actions may depend on dynamic session details.
The following template tokens are allowed in fields of these actions which will be replaced
with session-specific values at execution time. For most, there is both a named version for
scripts with multiple sessions and a raw version for those with only a single session:
- **Session Id**: `{session_id}` (`{<session name>.session_id}` when multiple sessions)
- **Result Message** (from waiting tests only): `{result_message}`
  (`{<session name>.result_message}` when multiple sessions)
- **Output Value** (from waiting tests only): `{wait_outputs.KEY}`
  (`{<session name>.wait_outputs.KEY}` when multiple sessions)
- **Inferno URL**: `{inferno_base_url}` (no session-specific version - always the same for all sessions)

Additionally, the optional `action_description:` key can be used to provide documentation
describing the action. This has no functional effect, but is echoed during script execution
for debugging purposes.

#### How to look for the next step

After taking an action, script execution returns to a polling mode where it checks the status
of a session to determine if it has reached a stable state to match against to identify the
next step. The step that was just executed can control two aspects of this process using
the following keys:
- `timeout:` *Optional* - specifies a number of sections to wait before aborting by canceling
  the run. The default is 120 seconds. After cancelling, Inferno will try to continue matching
  other states, but will still ultimately indicate failure for the script as a whole.
- `next_poll_session:` *Optional* - the name (not suite id) of the session to poll for the next
  step. Inferno only ever polls one session at a time, so in scripts with multiple sessions,
  it must be told which session to poll next. The first session configured is used to start.
  After executing a step, Inferno will either poll the session indicated in this key or the
  session polled after the previous step if none is specified.

## Scripts with Multiple Sessions

Scripts with multiple sessions involve additional complexity but are useful for scripting the execution of
Inferno suites against each other.

Considerations to keep in mind when creating script configuration files with multiple sessions:
- Include the `name:` key for each session for use as a key to refer to the session in the steps.
- The biggest change in that steps are specific to sessions and Inferno needs to know which session
  to poll next after each session. This means that steps
  - Will always declare the name of the session they match in the `session:` key.
  - Will sometimes declare the name of the next session to poll in the `next_poll_session:` key if
    diferent from the session of the matched step. This corresponds to steps in the manual execution
    where the tester must change over to the tab of the another session's UI.
- Templates for dynamic values in executed actions (commands and Inferno runs) will use the session-specific
  form.
- `NOOP` actions can be used to help clarify sequencing. For example, if two
  sessions both have long running tests that interact but complete in a particular
  order due to wait interactions, but don't require any external interactions. You
  could poll the session that will end last and look only for the `done` state,
  which would require `WAIT` actions on any `waiting` states so that Inferno
  recognizes them, or you could define states for each `waiting` state with `NOOP`
  actions to make clear how the active execution passes back and forth.

## Defining, Executing, and Securing Complex Commands

The `command` action option allows execution of arbitrary logic as a part of running a script.
The executed command can be as simple as a http request to trigger the end of an Inferno wait
dialog to a complex scripted interaction with the tested system, for example visiting and
manipulating the UI of the Inferno FHIR Reference Server using Selenium. The following
are important considerations when using this feature:
- The executed logic must be available to the local Inferno instance. If distributed with a test
  kit for use in CI/CD pipelines, this will mean including external scripts in the test kit. For
  additional gems required only for scripts, it is recommended to add the additional gems either
  - As a development dependency in the gemspec, or 
  - Within the `:test` and `:development` sections of the Gemfile and handle `LoadError` exception
    explicitly to warn users that use the script that they need to add additional gem dependencies.
- Scripts that use `command` actions must be executed with the `--allow-commands` option of the
  `execute_script` CLI enabled. This guard forces users to opt-in to arbitrary commands.
- Be careful executing scripts that have commands which you have not reviewed.

## Example Scripts

The following Test Kits include scripts that can be executed. To execute any of them
1. Checkout the repository locally and set it up to be run in developer mode
2. Either
   - Run all the defined scripts under the by executing `bundle exec rake execute_scripts:run_all`, or
   - Locate the a single target script configuration file under the `execution_scripts` directory
       and run `bundle exec inferno execute_script execution_scripts/path/to/script_config_file.yaml`
       pointing to the desired configuration file.

- [**Inferno Template**](https://github.com/inferno-framework/inferno-template): 
  New Inferno Test Kits created from the [inferno-template repository](https://github.com/inferno-framework/inferno-template)
  or the [`inferno new` CLI command](/docs/getting-started/inferno-cli.html#creating-a-new-test-kit)
  include a [simple execution configuration file](https://github.com/inferno-framework/inferno-template/blob/main/execution_scripts/inferno_template_script.yaml)
  for the example test suite included in the template.
- [**Inferno Core**](https://github.com/inferno-framework/inferno-core): Inferno Core contains
  [execution scripts](https://github.com/inferno-framework/inferno-core/tree/main/execution_scripts)
  for [sample development suites](https://github.com/inferno-framework/inferno-core/tree/main/dev_suites)
  that demonstrate features of Inferno and the `execute_script` CLI.
- [**SMART App Launch**](https://github.com/inferno-framework/smart-app-launch-test-kit):
  The SMART App Launch test kit includes both client and server tests and includes [execution scripts](https://github.com/inferno-framework/smart-app-launch-test-kit/tree/main/execution_scripts)
  demonstrating how multi-session scripts can be used to execute these tests against each other.
- [**(g)(10) Certification**](https://github.com/onc-healthit/onc-certification-g10-test-kit):
  The (g)(10) Certification test kit (and [US Core Core test kit](https://github.com/inferno-framework/us-core-test-kit/tree/main/execution_scripts)) 
  contains [scripts](https://github.com/onc-healthit/onc-certification-g10-test-kit/tree/main/execution_scripts)
  that demonstrate one approach to scripting external interactions with tested systems, in this
  case the Inferno Reference Server.