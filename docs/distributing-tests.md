---
title: Distributing Tests
nav_order: 16
section: docs
layout: docs

---
# Distributing Tests

Inferno allows Test Kits to be distributed like regular Ruby gems. In order to
make your Test Kit available to others:
1. Make sure your repository is organized as
described in [Template Layout](/docs/getting-started/repo-layout-and-organization.html).
2. Fill out the information in the `gemspec` file at the root of the
repository. The name of the file should match `spec.name` within the file and
the name of the main file in `lib`. For example, for the US Core Test Kit, this
file would be named `us_core_test_kit.gempsec` and `spec.name` would be
`'us_core_test_kit'`. This page has [recommended naming conventions](https://guides.rubygems.org/name-your-gem/)
for gems.
3. Create the gem. Run `gem build *.gemspec`. You should see the message `Successfully built RubyGem`. Your Test Kit can be shared by copying the `.gem` file and installing it as you would any other Ruby gem. 
4. **Optional:** Once your `gemspec` file has been updated, you can publish your gem
on [rubygems](https://rubygems.org/), the official Ruby gem repository. This will make
your Test Kit discoverable and available to the public. To publish your gem on rubygems,
you will first need to [make an account](https://guides.rubygems.org/publishing/#publishing-to-rubygemsorg) and
then run `gem push *.gem`. If you don't publish your gem on rubygems, users will still
be able to install your Test Kit if it is located in a public Git repository. 
See [Running Multiple Test Kits](/docs/getting-started-users.html#running-multiple-test-kits)
on how to reference a Test Kit gem available via Git.
