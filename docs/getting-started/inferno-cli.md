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
| `inferno help [COMMAND]` | Describes the available commands, or one specific command if specified. |
| `inferno migrate` | Runs database migrations. |
| `inferno new TEST_KIT_NAME` | Create a new test kit. Run `inferno new --help` for additional options. Does not require `bundle exec`. |
| `inferno services start` | Starts the background services (nginx, Redis, etc.) for Inferno. |
| `inferno services stop` | Stops the background services for Inferno. |
| `inferno start` | Starts Inferno web UI. Do not use `bundle exec` if the Inferno Core version is prior to 0.4.39. |
| `inferno suite SUBCOMMAND [...ARGS]` | Performs suite-based operations. The available subcommands are `describe`, `help`, and `input_template`.|
| `inferno suite help SUBCOMMAND` | View details on the suite subcommands. |
| `inferno suites` | Lists available test suites. |
| `inferno execute` | Execute tests in the command line instead of web UI. |
| `inferno evaluate IG_PATH [DATA_PATH]` | Run the FHIR evaluator in the command line. Does not require `bundle exec`. |
| `inferno version` | Output the version of Inferno Core (not the Test Kit). Does not require `bundle exec`. |
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

## Running a Test Kit in Command Line

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

Please note that inferno execute is still low maturity and has limitations. Inferno
currently cannot support SMART launch tests or tests that receive client requests
via CLI execution. Some tests are also expected to [run as a group](https://inferno-framework.github.io/docs/writing-tests/properties.html#run-as-group),
and may error or fail erroneously when run individually through CLI.

## Run the FHIR Evaluator

The Evaluator is a command-line tool that characterizes and analyzes HL7® FHIR® data in the context of a given Implementation Guide. The Evaluator is primarily designed to help ensure example datasets are comprehensive and useful.

Run the evaluation CLI with the command below:

```
bundle exec inferno evaluate ig_path [data_path]
```

For example:

Load the US core IG and evaluate the data in the provided example folder. If there are examples in the IG already, they will be ignored.

```
bundle exec inferno evaluate ./uscore7.0.0.tgz ./package/example
```

Loads the US core IG and evaluate the data included in the IG's example folder.

```
bundle exec inferno evaluate ./uscore7.0.0.tgz
```