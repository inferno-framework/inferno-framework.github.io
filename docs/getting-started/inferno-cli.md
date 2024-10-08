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

We recommend running all commands starting with `bundle exec` (e.g. `bundle exec inferno migrate`) because
it guarantees that only the specific gems and versions listed in `Gemfile.lock` are available to be used.
**Warning:** The `inferno start` command cannot be run with `bundle exec` prior to Inferno Core version 0.4.39.

The commands available include:

| Command      | Description |
|--------------|-------------|
| `inferno console` | Starts an interactive console session with Inferno. More information can be found on the [Debugging Page](debugging.html#interactive-console). |
| `inferno help [COMMAND]` | Describes the available commands, or one specific command if specified |
| `inferno migrate` | Runs database migrations |
| `inferno new TEST_KIT_NAME` | Create a new test kit. Run `inferno new --help` for additional options. |
| `inferno services start` | Starts the background services (nginx, Redis, etc.) for Inferno |
| `inferno services stop` | Stops the background services for Inferno |
| `inferno start` | Starts Inferno |
| `inferno suite SUBCOMMAND [...ARGS]` | Performs suite-based operations. The available subcommands are `describe`, `help`, and `input_template`.|
| `inferno suite help SUBCOMMAND` | View details on the suite subcommands. |
| `inferno suites` | Lists available test suites |
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