---
title: Getting Started
nav_order: 21
section: docs
layout: docs
---
# Getting Started for Inferno Users
Start here if you're interested in testing a FHIR server against one or more
existing Test Kits.

## Running an Existing Test Kit
Most Test Kits are developed using the [Inferno Template
repository](https://github.com/inferno-framework/inferno-template), which
provides scripts for standing up an instance of Inferno to run a selected Test
Kit. Running a Test Kit usually follows the below steps:

1. Install [Docker](https://www.docker.com/get-started).
1. Clone the repository for  the Test Kit you want to run.
1. Run `./setup.sh` in the Test Kit repository directory to retrieve the
   necessary docker images and create a database.
1. Run `./run.sh` to start Inferno.
1. Navigate to `http://localhost` to access Inferno.

For example, to run the [US Core Test
Kit](https://github.com/inferno-framework/us-core-test-kit):
```sh
git clone https://github.com/inferno-framework/us-core-test-kit.git
cd us-core-test-kit
./setup.sh
./run.sh
```

Always check the documentation for an individual Test Kit, however, since there may be
additional installation steps.

## Running Multiple Test Kits
There may be times when you wish to run multiple Test Kits in a single Inferno
instance. You can load and run two or more separate Test Kits by using [Inferno
Template](https://github.com/inferno-framework/inferno-template).

To create and deploy a custom combination of Test Kits with the Inferno Template
first create a new repository based off the template or clone the template:

```sh
git clone https://github.com/inferno-framework/inferno-template.git
```

Add Test Kits you want to include to the `Gemfile`:

```ruby
# Gem published on rubygems
gem 'smart_app_launch_test_kit'
# Gem available via git
gem 'us_core_test_kit',
    git: 'https://github.com/inferno-framework/us-core-test-kit.git',
    branch: 'main'
```

To enable the Test Kits, require them in in `lib/inferno_template.rb`:

```ruby
require 'smart_app_launch_test_kit'
require 'us_core_test_kit'
```

Inferno uses two validator "wrapper" services for profile validation:
 - [HL7 Validator Wrapper](https://github.com/hapifhir/org.hl7.fhir.validator-wrapper)
   - Used to validate resources as part of the test suite
 - [Inferno Validator Wrapper](https://github.com/inferno-framework/fhir-validator-wrapper) (deprecated)
   - Used to support the Validator UI until the UI is transitioned to use the HL7 service


For Test Kits that require profile validation, such as the US Core Test Kit, the
corresponding Implementation Guide needs to be placed in the
`lib/inferno_deployment/igs/` directory as a _.tgz_ file (i.e., _package.tgz_).
Inferno Test Kits already have the IGs in their repository,
so you can easily just copy it over from that Test Kit into your template directory.

For example, if you want to include the US Core IG in your template directory:
```sh
git clone https://github.com/inferno-framework/us-core-test-kit.git
cp -a us-core-test-kit/lib/us_core_test_kit/igs/. inferno-template/lib/inferno_template/igs/
```

Once this is done you can build and run the instance:

```sh
cd inferno_template
./setup.sh
./run.sh
```

_Note: Example Test Suites, Groups, Tests and IGs in the template can be removed._
