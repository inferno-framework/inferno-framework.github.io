---
layout: news
title: Continuous Integration and Deployment in Inferno
section: news
date: 2024-11-11
---

We are excited to announce our initial release of the `inferno execute` CLI, which lets you run Test Kits
in the shell and enables running Inferno in CI/CD pipelines.

<!-- break -->

## The Inferno Execute CLI

We were told by our community and stakeholders that adding
[Continuous Integration (CI)](https://github.com/resources/articles/devops/continuous-integration)
testing would be a good value add to Inferno, and so we listened and embarked on this task. Our
first step was implementing an [`inferno execute` command](/docs/getting-started/inferno-cli#running-a-test-kit-in-command-line),
which allows you to run server tests in the command line. An example:

{% include figure.html
    file="inferno-execute-example.png"
    alt="Console command running dev_validator Test Suite Test Group 1 on HAPI FHIR Server with tests passing and exit status 0."
    caption="Example usage of inferno execute"
    description="A screenshot of the console command bundle exec inferno execute --suite dev_validator --groups 1 --inputs \"url:https://hapi.fhir.org/baseR4\" patient_id:1234321."
    maxwidth="100%"
%}

Inferno's CLI is powered by the [Thor gem](https://github.com/rails/thor/wiki), and follows common Unix conventions
such as returning 0 on success only. You can find Inferno's [CLI](https://inferno-framework.github.io/docs/getting-started/inferno-cli.html) on our website,
along with a [guide on `inferno execute`](https://inferno-framework.github.io/docs/getting-started/inferno-cli.html#running-a-test-kit-in-command-line).
You can also enter your own test kit and run `bundle exec inferno execute --help` to see the full Inferno execute specification
for your current version.

We also made a proof-of-concept
[Inferno CI workflow file](https://github.com/inferno-framework/inferno-reference-server/blob/main/.github/workflows/inferno_ci.yml)
using `inferno execute` and run it on our [Reference Server](https://github.com/inferno-framework/inferno-reference-server).
Our dogfooding helps enforce Inferno's reliability as a framework and testing platform. If you want to implement
your own CI/CD pipeline using Inferno, take a look at our [guide](https://inferno-framework.github.io/docs/ci-cd-usage.html).

## Next Steps

We'll keep improving the Inferno Core, the Inferno Framework site, and the FHIR Community
as a whole with future releases. As always, we welcome your feedback and ideas for improvement.
Thank you for your continued support!
