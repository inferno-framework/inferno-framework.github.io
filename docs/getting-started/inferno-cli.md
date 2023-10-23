---
title: Inferno CLI
nav_order: 2
parent: Getting Started
section: docs
layout: docs
---
# Inferno Command Line Inferface

### Inferno Commands
The Inferno Command Line Interface is available to developers running Inferno with a local Ruby installation.
The commands available include:

| Command      | Description |
|--------------|-------------|
| `inferno console` | Starts an interactive console session with Inferno. More information can be found in the next section. |
| `inferno help [COMMAND]` | Describes the available commands, or one specific command if specified |
| `inferno migrate` | Runs database migrations |
| `inferno services start/stop` | Starts or stops the background services (nginx, Redis, etc.) for Inferno |
| `inferno start` | Starts Inferno |
| `inferno suite SUBCOMMAND ...ARGS` | Performs suite-based operations |
| `inferno suites` | Lists available test suites |
  
&nbsp;
&nbsp;

### Interactive Console
A local Ruby installation allows you to use [pry](https://pry.github.io/),
a powerful interactive console, to explore and experiment with your tests using the
`inferno console` command:
```ruby
ᐅ bundle exec inferno console
[1] pry(main)> suite = InfernoTemplate::Suite
=> InfernoTemplate::Suite
[2] pry(main)> suite.groups
=> [#<Inferno::Entities::TestGroup @id="test_suite_template-capability_statement", @short_id="1", @title="Capability Statement">,
 #<InfernoTemplate::PatientGroup @id="test_suite_template-patient_group", @short_id="2", @title="Patient  Tests">]
[3] pry(main)> suite.groups.first.tests
=> [#<Inferno::Entities::Test @id="test_suite_template-capability_statement-capability_statement_read", @short_id="1.01", @title="Read CapabilityStatement">]
```