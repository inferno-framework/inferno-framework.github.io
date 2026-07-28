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

- **Call `super` (or `yield`) exactly once.** An override that never runs the
  test silently skips it and records no result for it. An override that runs it
  twice runs the test twice, including any HTTP requests it makes.
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

## Example: One Trace Per Test

The motivating case for this hook is distributed tracing. If a deployment
instruments the background worker, for example with OpenTelemetry
auto-instrumentation of Sidekiq, then the span for the job becomes the root of
the trace, and every request made by every test in the run nests underneath it.
An entire run then arrives at the trace store as a single trace that can be many
minutes long and, in our case, tens of thousands of spans. That is a problem
regardless of which backend is used:

- A trace is meant to represent one logical operation, and no trace UI renders a
  multi-minute waterfall of thousands of spans in a way anyone can read.
- Trace stores cap the size of a single trace (for example, Grafana Tempo's
  `max_bytes_per_trace` defaults to 5 MB) and drop spans past the limit, so
  the end of a long run is lost.

Detaching the context inside `around_test` gives one trace per test instead,
correlated by the test run id:

```ruby
module PerTestTraceRoot
  def around_test(test)
    tracer = OpenTelemetry.tracer_provider.tracer('inferno')

    # Detach from the enclosing job span so that each test starts its own trace
    # rather than becoming another branch of the run's trace.
    OpenTelemetry::Context.with_current(OpenTelemetry::Context::ROOT) do
      tracer.in_span(
        "inferno.test #{test.id}",
        attributes: {
          'inferno.test_run_id' => test_run.id,
          'inferno.test_id' => test.id,
          'inferno.test_session_id' => test_session.id
        }
      ) do
        super
      end
    end
  end
end

Inferno::TestRunner.prepend(PerTestTraceRoot)
```

Each test is now a bounded trace on its own, and searching for
`inferno.test_run_id` returns every test in a run. OpenTelemetry is used here
only as an illustration; the hook has no knowledge of it, and the same shape
works for a metrics client, a timer, or a log context.

## Other Uses

The hook is not specific to tracing. It is also a reasonable place to:

- emit a per-test duration metric, as in the first example above
- add the current test and run to a logging context, so that log lines emitted
  while a test runs can be attributed to it
- report progress for long-running suites to something outside Inferno

Because it wraps a single test rather than the whole run, none of these need to
know how the suite is structured or how the runner recurses through it.
