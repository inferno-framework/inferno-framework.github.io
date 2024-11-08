---
layout: news
title: New Execute CLI in Inferno Core v0.4.44 and Breaking Change in v0.5.0
section: news
date: 2024-11-08
---

We are excited to announce our initial release of an `inferno execute` CLI that lets you run Test Kits
in the shell, with the intention of running Inferno in CI/CD pipelines. This feature is included in
Inferno Core v0.4.44 release. We also briefly cover the technical breaking change in our Inferno Core
v0.5.0 release in this post.

## v0.4.44 and Inferno Execute CLI

We were told by our community and stakeholders that adding
[Continuous Integration (CI)](https://github.com/resources/articles/devops/continuous-integration)
testing would be a good value add to Inferno, and so we listened and embarked on this task. While
implementing the full breadth of Inferno features into automated CI tooling is a far goal, we
believe we took a step in the right direction with our new [`inferno execute` command](/TODO).

For a quick start on the `inferno execute` command follow these steps:
 1. Have Ruby setup to 3.1.2
 2. Clone the US Core Test Kit repository. You should be on Release v0.9.0.
```
TODO
```
 3. Enter Test Kit as working directory and install dependencies.
```
cd us-core-test-kit
bundle install
```
 4. Launch background services
```
bundle exec inferno services start
```
 5. Use `inferno execute` to run the US Core v3.1.1 Single Patient API Test Group against our reference
server
```
bundle exec inferno execute --suite us_core_v311 \
                            --suite-options smart_app_launch_version:smart_app_launch_1 \
                            --groups 2 \
                            --inputs "url:https://inferno.healthit.gov/reference-server/r4" \
                                     patient_ids:85,355 \
                                     "smart_credentials:{\"access_token\":\"SAMPLE_TOKEN\"}"

```

and if it all works successfully you should see something like this:

TODO IMAGE

The limitations...


You can see our [documentation](/TODO) on the `inferno execute` CLI or run `bundle exec inferno execute --help`
for more guidance. You can also view our [CI documentation](/TODO) if you want to run it in CI.

The v0.4.44 release also included various other bug fixes and enhancements.
You can see the v0.4.44 release on GitHub for more details.

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

You can see the v0.5.0 release on GitHub for more details.

---

As always, we welcome your feedback and look forward to enhancing Inferno in future
releases. Thank you for your continued support!
