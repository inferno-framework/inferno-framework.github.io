---
layout: news
title: New Execute CLI in Inferno Core v0.4.44 and Breaking Change in v0.5.0
section: news
date: 2024-11-11
---

We are excited to announce our initial release of the `inferno execute` CLI, which lets you run Test Kits
in the shell and enables running Inferno in CI/CD pipelines. This feature is included in
Inferno Core v0.4.44 release. We also briefly cover the technical breaking change in our Inferno Core
v0.5.0 release in this post.

## v0.4.44 and Inferno Execute CLI

We were told by our community and stakeholders that adding
[Continuous Integration (CI)](https://github.com/resources/articles/devops/continuous-integration)
testing would be a good value add to Inferno, and so we listened and embarked on this task. Our
first step was implementing an [`inferno execute` command](/docs/getting-started/inferno-cli#running-a-test-kit-in-command-line),
which you can view an example of below.

{% include figure.html
    file="inferno-execute-example.png"
    alt="Console command running dev_validator Test Suite Test Group 1 on HAPI FHIR Server with tests passing and exit status 0."
    caption="Example usage of inferno execute"
    description="A screenshot of the console command bundle exec inferno execute --suite dev_validator --groups 1 --inputs \"url:https://hapi.fhir.org/baseR4\" patient_id:1234321."
    maxwidth="100%"
%}

Inferno's CLI is powered by the [Thor gem](https://github.com/rails/thor/wiki), which allows for array
and hash type CLI arguments. The command is also designed to follow Unix convention and return 0 on a
success. If the designated Test Suite fails, or if selected non-optional Test Groups or Tests fail, the
command will exit with a non-zero status.

This should allow anyone to use `inferno execute` in bash scripts or YAML workflow files to perform
their own CI with Inferno. Infact we made our own proof-of-concept
[Inferno CI workflow file](https://github.com/inferno-framework/inferno-reference-server/blob/47c7b8cc687f6ac7eddc117e5d7d8fe0b0d61cf1/.github/workflows/inferno_ci.yml)
<!-- TODO replace above link when file gets merged -->
on our [Reference Server](https://github.com/inferno-framework/inferno-reference-server).

Unfortunately while doing so, we found some limitations with running Inferno in a CI environment when
compared to what Inferno can do normally. These limitations are:

 - We could not emulate TLS, causing all TLS version tests to fail. We made a quick fix for this by
implementing a feature where having `INFERNO_DISABLE_TLS_TEST=true` in the environment would bypass the
test. See our
[TLS Test Kit](https://github.com/inferno-framework/tls-test-kit?tab=readme-ov-file#disabling-the-tls-test)
for details. We are also investigating more generalizable solutions for the future such as test quarantining.

 - Certain features such as [`scratch`](/docs/advanced-test-features/scratch.html) require tests to run as a
group, however these tests may not always be marked under `run_as_group` and the CLI will let you run these
independently. Such tests will fail or error in CLI. For this reason we encourage Test Kit writers to use
`run_as_group` where appropriate, and we encourage Test Kit users to submit issues and try the latest release.

 - We do not support SMART Launch tests or client testing in CI. Any tests that rely on recieving HTTP requests
won't work. We are investigating supporting this feature via CLI in the future.

Despite these short comings, the `inferno execute` CLI opens up a new potential for the Inferno in CI, scripting,
and automation. You can see our [documentation](/docs/getting-started/inferno-cli#running-a-test-kit-in-command-line)
on the `inferno execute` CLI or run `bundle exec inferno execute --help` for more guidance. You can also view our
[CI documentation](/docs/advanced-test-features/using-test-kits-in-ci-cd.md) if you want to run it in CI.

The v0.4.44 release also included various other bug fixes and enhancements.
You can see the [v0.4.44 release on GitHub](https://github.com/inferno-framework/inferno-core/releases/tag/v0.4.44)
for more details.

## v0.5.0

Inferno Core v0.5.0 added a small change that disallows duplicate ids for Tests, Test Groups, and Test
Suites in Inferno. While this is a technically a breaking change, we do not expect this to cause an
issue in the majority of Test Kits and users out there. The motivation for this change was painfully
slow load times in some of our Test Kits, and after profiling the issue we found that duplicate ids
in the database was causing the slowdown. After this update we saw significant improvements in performance.

Most Test Kits are likely running on Inferno Core v0.4.x, and if this suits your needs there is no need
to update. However, if you want the performance improvements you can run `bundle update inferno_core` in
your Test Kit directory. If there is a duplicate id in your Test Kit, the command `inferno start` will
fail to start, and you need to go rename one or more ids in the Test Kit.

You can see the
[v0.5.0 release on GitHub](https://github.com/inferno-framework/inferno-core/releases/tag/v0.5.0)
for more details.

## Next Steps

We'll keep improving the Inferno Core, the Inferno Framework site, and the FHIR Community
as a whole with future releases. As always, we welcome your feedback and ideas for improvement.
Thank you for your continued support!
