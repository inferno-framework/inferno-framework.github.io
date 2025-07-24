---
title: Template Layout
layout: docs
nav_order: 1
parent: Getting Started
section: docs
layout: docs
---

## Template Layout

After cloning the [Inferno Test Kit
Template](https://github.com/inferno-framework/inferno-template) repository, or
running `inferno new`, you will have a directory structure that looks something
like this:

```
├── Dockerfile
├── Gemfile
├── config
│   └── ...
├── config.ru
├── data
│   └── igs
│   └── redis
│       └── ...
├── docker-compose.yml
├── docker-compose.background.yml
├── inferno_template.gemspec
├── lib
│   ├── inferno_template
│   │   ├── metadata.rb
│   │   └── igs
│   │       └── ...
│   ├── requirements
│   |   └── Inferno Requirements Template.xlsx
│   └── inferno_template.rb
├── spec
│   ├── ...
└── worker.rb
```
- `Dockerfile` - This file controls how the Docker image for your tests is built.
- `Gemfile` - This file is where you add extra Ruby dependencies.
- `config` - This folder contains configuration for the database and web
  servers.
- `config.ru` - This is the main file for Inferno's web server process.
- `data` - This folder includes the database, Redis snapshots, and IG files for
  the FHIR validator. The contents of this folder are created automatically and
  should not be edited.
- `docker-compose.yml` - This file coordinates and runs all of the services Inferno
  needs.
- `docker-compose.background.yml` - This file coordinates and runs the background
  services needed for running Inferno.
- `inferno_template.gemspec` - This file controls how your tests are packaged
  up as a distributable Ruby gem. This is also where you can add additional Ruby
  gems if you need them.
- `lib` - This folder is where the code for your tests goes.
- `lib/{YOUR_TEST_KIT_NAME}/metadata.rb` - This file contains the metadata for
  your test kit. See [Test Kit
  Metadata](/docs/getting-started/test-kit-metadata.html) for more information.
- `lib/{YOUR_TEST_KIT_NAME}/igs` - This is where IG packages go if a test kit
  relies on an IG to generate tests, or relies on an unpublished IG which is not
  available on the FHIR packages server. IG files do not need to be included to
  validate resources against published IGs. See `/lib/inferno_template/igs` for
  reference.
- `lib/{YOUR_TEST_KIT_NAME}/requirements` - This folder contains a [template
  spreadsheet](https://github.com/inferno-framework/inferno-core/blob/main/lib/inferno/apps/cli/templates/lib/%25library_name%25/requirements/Inferno%20Requirements%20Template.xlsx)
  for collecting discrete requirements to use with Inferno's optional requirement
  management infrastructure. See [Requirements](/docs/advanced-test-features/requirements.html)
  for more information on how to use the requirements tools.
- `spec` - This folder is for unit tests.
- `worker.rb` - This is the main file for Inferno's test runner process.

## Test Organization
Inferno Test Kits are organized like Ruby gems to enable them to be easily
distributed.
- Tests must live in the `lib` folder.
- The `lib` folder should contain only one file, which is the main entrypoint
  for your Test Suite. The name of this file should be `your_test_kit_name.rb`,
  and this is what other Test Kits will `require` in order to load your tests.
- All other test files should live in a subdirectory in `lib`, and
  the convention is to have this subdirectory have the same name as the single file in `lib`,
  minus the extension.
- If a test kit relies on an unpublished IG, the `package.tgz` file for that IG
  should be placed in `lib/your_test_kit_name/igs`. This will allow you to
  validate against the profiles in that IG.

For example, if I were creating a Test Kit for the US Core Implementation Guide,
my `lib` folder would look like this:
```
lib
├── us_core_test_kit.rb
└── us_core_test_kit
    ├── patient_tests.rb
    ├── condition_tests.rb
    ├── metadata.rb
    ├── ...
    └── igs
        └── unpublished_ig_package.tgz
```
And anyone wanting to use this test kit, would load it with `require
'us_core_test_kit'`.

If you want more examples, check out the [Community
Page](/community/test-kits.html) to view all available Test Kits currently
registered with the Inferno Team.
