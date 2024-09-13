---
title: Inferno CLI
nav_order: 2
parent: Getting Started
section: docs
layout: docs
---
{:toc-skip: .h3 data-toc-skip=""}

# Inferno Command Line Interface

## Inferno Commands
{:toc-skip}

The Inferno Command Line Interface is available to developers running Inferno with a local Ruby installation.

We recommend running all commands starting with `bundle exec` (e.g. `bundle exec inferno migrate`) because
it guarantees that only the specific gems and versions listed in `Gemfile.lock` are available to be used.
**Warning:** The `inferno start` command cannot be run with `bundle exec` prior to Inferno Core version 0.4.39.

The commands available include:

| Command      | Description |
|--------------|-------------|
| `inferno console` | Starts an interactive console session with Inferno. More information can be found on the [Debugging Page](debugging.html#interactive-console). |
| `inferno help [COMMAND]` | Describes the available commands, or one specific command if specified |
| `inferno migrate` | Runs database migrations |
| `inferno services start` | Starts the background services (nginx, Redis, etc.) for Inferno |
| `inferno services stop` | Stops the background services for Inferno |
| `inferno start` | Starts Inferno |
| `inferno suite SUBCOMMAND ...ARGS` | Performs suite-based operations. The available subcommands are `describe`, `help`, and `input_template`.|
| `inferno suite help SUBCOMMAND` | View details on the suite subcommands. |
| `inferno suites` | Lists available test suites |
{: .grid.command-table}
