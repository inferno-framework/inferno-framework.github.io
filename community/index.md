---
title: Welcome
nav_order: 1
layout: docs
section: community
---
{:toc-skip: .h4 data-toc-skip=""}

# Inferno Community

Welcome to the Inferno Community.  The Inferno Framework is being developed
under the Apache 2.0 license and the source is available in the [Inferno Framework GitHub Organization](https://github.com/inferno-framework).  External participation and contributions to Inferno are encouraged and welcome. See below for how to engage with the Inferno team!

## Inferno Team

The fastest way to reach the Inferno team is via the 
[Inferno Chat on Zulip](https://chat.fhir.org/#narrow/stream/179309-inferno).

You can also
[e-mail the team](mailto:inferno@groups.mitre.org).

## Reporting Issues

We welcome feedback on the Test Kits that we have developed[^1], including but not limited to the following areas:

[^1]: The Inferno team did not develop every Test Kit on the Inferno Framework GitHub. More information can be found on each Test Kit's GitHub repository.

- Validation logic, such as potential bugs, lax checks, and unexpected failures.
- Requirements coverage, such as requirements that have been missed, tests that necessitate features that the IG does not require, or other issues with the interpretation of the IG's requirements.
- User experience, such as confusing or missing information in the test UI.

Please report any issues on the given Test Kit's Issues page under the [Inferno Framework GitHub Organization](https://github.com/inferno-framework).

## Contributions

We welcome external contributions to our repositories. The information below explains expectations for contributors and the contribution process.

### Code of Conduct
{:toc-skip}

The Inferno Team has adopted a Code of Conduct that we expect all internal and external contributors to adhere to. The full text can be [found here](/community/code-of-conduct).

### Branch Organization
{:toc-skip}

The latest version of any Inferno repository is on the `main` branch, and any Pull Request (PR) should be made against the `main` branch.

### Semantic Versioning
{:toc-skip}

Inferno projects follow [semantic versioning](https://semver.org/). We release patch versions for bugfixes, minor versions for new features, and major versions for any breaking changes. When we make breaking changes, we make note of it in the release and include what users have to do migrate changes.

For the [ONC Certification (g)(10) Standardized API Test Kit](https://github.com/onc-healthit/onc-certification-g10-test-kit), we release either a minor or major version monthly. Any issues that are reported for this Test Kit and are resolved with a given release are tagged with that release version. They are also tagged with "add constraint" if they cause systems that previously passed tests to now fail.

### Proposing a Change
{:toc-skip}

If you are interested in making a non-trivial change to one of our GitHub repositories, we recommend [reporting an issue](#reporting-issues) first. This allows us to make sure that the Inferno maintainers are on board with your approach before you put significant effort into this change. It is fine to submit a PR without a tracking issue for bug fixes, but we still recommend doing so in case we don’t accept that specific fix but want to keep track of the issue.

### Submitting a Pull Request
{:toc-skip}

When submitting a PR, please do the following:
- Confirm that all linters and tests pass
- Include any steps necessary to run and test the PR in the description