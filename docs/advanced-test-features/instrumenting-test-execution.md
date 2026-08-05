---
title: Instrumenting Test Execution
nav_order: 10
parent: Advanced Features
layout: docs
section: docs
---
{:toc-skip: .h4 data-toc-skip=""}

# Instrumenting Test Execution

Inferno runs an entire test run inside a single call stack: the background job
that executes a run calls `Inferno::TestRunner#start`, which walks the suite and
calls `#run_test` once per test. That is convenient for running tests, but it
means anything that observes the run from the outside, such as a tracing library
that instruments the background worker, sees one long-lived operation rather than
one operation per test.

`Inferno::TestRunner#around_test` is an extension point for attaching
instrumentation to each individual test. It receives the test about to be run and
yields to run it, so an override can start and finish a span, a trace, a timer,
or a log context around exactly one test.

This is aimed at people deploying Inferno rather than at people writing tests.
Nothing about a suite or its tests changes, and no additional dependency is
required. If you are trying to work out why a specific test behaves the way it
does while you are writing it, see
[Debugging](/docs/getting-started/debugging.html) instead.

## The Hook

The default implementation simply yields:

```ruby
def around_test(_test)
  yield
end
```

Override it by prepending a module to `Inferno::TestRunner`:

```ruby
module TestTiming
  def around_test(test)
    started_at = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    super
  ensure
    duration = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started_at
    Inferno::Application['logger'].info(
      "test=#{test.id} test_run=#{test_run.id} duration=#{duration.round(3)}s"
    )
  end
end

Inferno::TestRunner.prepend(TestTiming)
```

Inside the override, `test` is the test class being run (an
`Inferno::Entities::Test` subclass, so `test.id`, `test.short_id`, and
`test.title` are all available), and the runner's own `test_run` and
`test_session` readers are available for correlating the test with the run it
belongs to.

An override must run the test, so it has to:

- **Call `super` exactly once.** An override that never runs the test silently
  skips it and records no result for it. An override that runs it twice runs
  the test twice, including any HTTP requests it makes.
- **Return the value it gets back unchanged.** That value is the test's result,
  and the runner uses it to roll up group and suite results. Using `ensure`, as
  above, keeps the return value intact; assigning `super` to a variable and
  returning something else does not.
- **Let exceptions propagate.** A failing test is recorded as a result rather
  than raised, so an exception escaping the block is a failure of the test runner
  itself. Swallowing it leaves the run in an inconsistent state. If the
  instrumentation needs to record the exception, re-raise it afterwards.

Put the override in a file that loads in every process that executes tests. A
file under your test kit's `lib` directory that is required from your test kit's
main file will be picked up by the web server, the background worker, and the
CLI.

## Usage Best Practices

- **When implementing distributed tracing, use the hook to start a separate
  trace per test.** A whole run instrumented as one operation produces a single
  very long trace, which trace stores truncate and trace UIs cannot render
  usefully. Detach from the enclosing context inside the override so each test
  becomes its own bounded trace, correlated by the test run id. For example,
  with OpenTelemetry:

  ```ruby
  module PerTestTraceRoot
    def around_test(test)
      tracer = OpenTelemetry.tracer_provider.tracer('inferno')
      OpenTelemetry::Context.with_current(OpenTelemetry::Context::ROOT) do
        tracer.in_span(
          'inferno.test',
          attributes: {
            'inferno.test_run_id' => test_run.id,
            'inferno.test_id' => test.id
          }
        ) do
          super
        end
      end
    end
  end

  Inferno::TestRunner.prepend(PerTestTraceRoot)
  ```

- **Give spans a generic name and put the test's identity in attributes**, as
  in the example above. Tracing backends treat the span name as a
  low-cardinality dimension and generate metrics keyed on it, so naming spans
  after tests creates one useless metric series per test. A constant name
  allows aggregation across tests; attributes still support filtering and
  grouping by test.

- **If the override records outcomes, reserve error status for results of
  `'error'`.** A `'fail'` result is the expected outcome of testing a
  non-conformant system, not an error.

- **`around_test` covers test execution and the storage of results and
  requests made during the execution.** A duration measured with the hook is
  the wall time a user waited for the test, not purely the test body; for a
  request-heavy test, persistence can be a substantial share. Instrument
  `#persist_result` as well to separate the two.

- **The hook is not specific to tracing.** The same shape works for a per-test
  duration metric, a logging context that attributes log lines to the running
  test, or progress reporting for long suites, and none of these need to know
  how the suite is structured or how the runner recurses through it.
