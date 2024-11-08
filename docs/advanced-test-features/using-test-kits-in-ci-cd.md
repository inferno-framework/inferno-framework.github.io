---
title: Using Test Kits in CI/CD
nav_order: 14
parent: Advanced Features
layout: docs
section: docs
---

# Using Test Kits in CI/CD

Since inferno execute enables running Inferno tests in CLI, it may be used to construct
CI/CD pipelines. The generic steps around automatically running a Test Kit are:

 1. Setup a container or environment with Ruby and Docker
 2. Obtain your target Test Kit version and make it your working directory
 3. Launch background Inferno services: `bundle exec inferno services start`. This
command works on top of docker compose and daemonizes the processes for you.
 4. Confirm that background services, possibly with the [wait-for](https://github.com/eficode/wait-for) script.
 5. Launch your FHIR server and confirm that it is ready to receive requests.
 6. Select the Tests, Test Groups, and Test Suites you want in CI and run them
with `inferno execute`. See
[Running a Test Kit in Command Line](https://inferno-framework.github.io/docs/getting-started/inferno-cli.html#creating-a-new-test-kit)
for more information. The command will exit with status 0 if the Inferno Summarizer deems
it a pass.
    + You can run multiple inferno execute commands, but remember that each call represents
its own test session.
    + Since TLS cannot always be emulated in CI, you can add the environment variable
`INFERNO_DISABLE_TLS_TEST=true` to mark all TLS tests as omitted and may allow the
Test Suite to pass.
 7. Clean up. You can stop Inferno services with `bundle exec inferno services stop`.

If you want to use GitHub Actions for your CI/CD pipeline, or run the
ONC Certification (g)(10) Test Kit in CI/CD, you can view our [workflow file](https://github.com/inferno-framework/inferno-reference-server/blob/5e0d06ad5414efa93499fd3de093e29cf5e6d9d1/.github/workflows/inferno_ci.yml)
on the Inferno Reference Server.
