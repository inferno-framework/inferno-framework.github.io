---
title: Requirements
nav_order: 8
parent: Advanced Features
layout: docs
section: docs
---

# Requirements

Inferno was designed to support conformance testing for FHIR systems against
standards and regulations. Inferno provides tools for associating specification
requirements with suites and tests within them. This allows
- Developers to track how well test suites cover a specification's
  requirements.
- Testers to see the requirements that drove the test design within the
  [user interface](/docs/user-interface.html#viewing-verified-requirements).

## Process Overview

To use Inferno's requirements tooling, test developers will need to

1. [Extract discrete specification requirements](#extract-discrete-requirements)
2. [Make requirements available to an Inferno test kit](#make-requirements-available-to-a-test-kit)
3. [Identify suite requirements](#identify-suite-requirements)
4. [Mark requirements as verified by a test, group, or suite](#mark-requirements-as-verified)

Once these steps are done, then

- Requirement details will be [displayed in the user interface](/docs/user-interface.html#viewing-verified-requirements),
  and
- A [requirement coverage report can be generated](#generate-a-suite-coverage-report) for each suite.

## Extract Discrete Requirements

Inferno's requirements tooling links discrete, atomic requirements to suites
and the tests that verify them. However, FHIR IGs and related regulations
define most of their requirements in narrative form, without a clear way to
reference the individual, atomic requirements that they place on conformant
systems. To use the Inferno requirements tooling, test developers must first
extract atomic requirements from the target IG's narrative sections and give
them identifiers so that they can be easily referenced.

Inferno defines a [template spreadsheet](https://github.com/inferno-framework/inferno-core/blob/main/lib/inferno/apps/cli/templates/lib/%25library_name%25/requirements/Inferno%20Requirements%20Template.xlsx)
into which requirements can be extracted for use within Inferno. The "Info"
sheet of that spreadsheet includes details on what each column on the
"Requirements" sheet means and includes some best practices for filling
it out with discrete requirements from a FHIR IG.

## Make Requirements Available to a Test Kit

For requirements to be available for linking to test suites, they must be
loaded by Inferno. Inferno loads requirements from two locations:
- csv files found in a specific folder of the test kit:
  `/lib/[test kit source]/requirements`, and
- requirements available to the inferno test kit gems that the test kit is
  dependent on.

Loaded requirements must be unique so each requirement can only be defined
in a single test kit.

**Generating the requirements csv file**

Inferno includes a script that generates the requirements csv file for a test
kit by combining requirement lists from spreadsheets found in the
`/lib/[test kit source]/requirements` folder. It requires that each
spreadsheet's filename ends with `.xlsx` and that each is built off the
[Inferno Requirements Template](https://github.com/inferno-framework/inferno-core/blob/main/lib/inferno/apps/cli/templates/lib/%25library_name%25/requirements/Inferno%20Requirements%20Template.xlsx)
with requirements on the `Requirements` sheet and the requirement set id
present in the `Id` field of the `Metadata` sheet. To run the generation script
from the test kit root directory, run `bundle exec inferno requirements
export_csv`.

**Requirements csv file details**

Inferno's `requirements export_csv` CLI command generates a csv file called
`[test kit name]_requirements.csv` in the `requirements` directory. The file
will contain a row for each requirement found in spreadsheets within the
`requirements` directory, each with the following columns:
- `Req Set`: the requirement set id.
- `ID`: the requirement id within the set.
- `URL`: a link to the requirement source.
- `Requirement`: the requirement text, formatted as markdown.
- `Conformance`: the discrete conformance verb for the requirement.
- `Actors`: comma-delimited list of actors that must meet this requirement.
- `Sub-Requirement(s)` (optional): requirements referenced by this requirement
  which must themselves be met for a system to meet this requirement.
- `Conditionality` (optional): boolean value that will be true if the
  requirement must be met only in certain circumstances. Note that the details
  and not included here.
- `Not Tested Reason` (optional): may include an indicator that this
  requirement is not expected to be verified by a suite, e.g., because it
  cannot be verified.
- `Not Tested Details` (optional): details on why this requirement is not
  expected to be tested.

{% include figure.html 
    file="us-core-requirements-csv.png"
    alt="Screenshot of some US Core requirements"
    caption="Example US Core requirements in the Inferno csv format"
    maxwidth="666px"
%}

**Keeping the requirements csv file in sync**

To help keep the csv file in sync with the spreadsheet, test kit repositories
can use the `bundle exec inferno requirements check` command in the CI/CD
pipeline to check that the files are in sync ([github example](https://github.com/inferno-framework/us-core-test-kit/blob/main/.github/workflows/ruby.yml#L64)
for the us-core test kit).

## Identify Suite Requirements

Each suite can declare which requirements the systems tested using the suite
are responsible for meeting. The `requirement_sets` property takes a list of
`RequirementSet` objects each representing a list of requirements from a single
requirement set. Taken together, these lists constitute the suite's
requirements. 

Each `requirement_sets` entry must include:
- `identifier`: the requirement set identifier as a string.
- `title`: a human-readable title for this requirement set, used for display
  only.

**Filtering requirement sets**

By default, the requirement list for a `requirement_sets` entry will include all
requirements from the indicated set. Additional properties allow developers to
scope which requirements the entry's list contains:
- `actor`: if present, only requirements from the referenced set placed on the
  indicated actor are included.
- `requirements`: if present, can either be
  - a comma-delimited string listing the specific requirement Ids from the set
    to be included, or
  - the string `'referenced'`, specifying that the entry's list includes all
    requirements from the indicated set that are referenced through the
    `Sub-requirement(s)` column of another included requirement.

**Tying requirement sets to suite options**

Sometimes, certain requirements are only part of the suite's requirements
when specific suite options are selected. Developers can indicate this using:
- `suite_options`: if present, must be formatted as a hash of suite option
  name-value pairs indicating which suite options must be chosen for the
  list of requirements represented by this entry to be included.

**Requirement sets example**

For example, the following suite definition uses these various options to
include the following in the suite's requirements:
- All requirements from `example-regulation`,
- "Provider" actor requirements `2`, and `4-5` from `example-ig_v1`, and
- When the `2.0.0` option is selected for the `ig_version` suite option,
  all "Provider" actor requirements from `example-ig_v2`.

```ruby
class SuiteWithLinkedRequirements < Inferno::Test
  id :suite_with_linked_requirements
  title 'Suite with linked requirements'
  requirement_sets(
    {
      identifier: 'example-regulation',
      title: 'Example Regulation',
    },
    {
      identifier: 'example-ig_v1',
      title: 'Example Implementation Guide Version 1',
      actor: 'Provider',
      requirements: '2, 4-5' # Only include these specific requirements
    },
    {
      identifier: 'example-ig_v2',
      title: 'Example Implementation Guide Version 2',
      actor: 'Provider' # Only include requirements for the 'Provider' actor
      suite_options: {      # Only include these requirements if the ig
        ig_version: '2.0.0' # version 2.0.0 suite option is selected
      }
    }
  )
end
```

[`requirement_sets` in the API
docs](/inferno-core/docs/Inferno/DSL/SuiteRequirements.html#requirement_sets-instance_method)

## Mark Requirements as Verified

Requirements can be marked as verified at any level of a [test suite's structure](/docs/writing-tests/#test-suite-structure)
(suite, group, or test) using the `verifies_requirements` property.
`verifies_requirements` takes a list of strings each containing a requirement
reference of the form `[requirement set id]@[requirement id]`. For example,
the following test definition indicates that it verifies 3 requirements from
two different sets (requirements `1` and `2` from `example-regulation` and
requirement `2` from `example-ig_v1`):

```ruby
class TestWithVerifiedRequirements < Inferno::Test
  id :test_with_verified_requirements
  title 'Test with verified requirements'
  verifies_requirements 'example-regulation@1', 'example-regulation@2', 'example-ig_v1@2'

  run do
    # test logic that verifies that the system meets the listed requirements
  end
end
```

[`verifies_requirements` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#verifies_requirements-instance_method)

## Generate a Suite Coverage Report

The Inferno CLI includes a command `requirements coverage` that can be
used to create a requirements coverage report for each suite. To determine
which requirements are verified for a suite, the command walks the suite's
test tree and uses the `verifies_requirements` property at each position to
determine which requirements it tests. If Inferno identifies a requirement that
is verified, but is not linked to the suite using the `requirement_sets`
property, the command will display a warning.

**Report format**

The `requirements converage` CLI command generates a csv file for each suite,
named `[suite id]_requirements_coverage.csv` in the `requirements/generated`
directory. The coverage report includes a row for each of the suite's
requirments. It includes all columns from the requirements csv generated
by the `requirements export_csv` CLI command (see the [Make Requirements
Available to a Test Kit](#make-requirements-available-to-a-test-kit) section
for details) except for the `Sub-requirement(s)` column. In addition, it contains
two additional columns indicating the short (number-based) and full ids for the
tests and groups that verify the requirement in that row.

**Keeping the coverage report csv files in sync**

To help keep the generated csv report files in sync with the requirements and
the tests, test kit repositories can use the `bundle exec inferno requirements check_coverage`
command in the CI/CD pipeline to check that the files are in sync
([github example](https://github.com/inferno-framework/us-core-test-kit/blob/main/.github/workflows/ruby.yml#L64)
for the us-core test kit). Note that warnings due to verified requirements that
are not linked to the test suite do not cause the `requirements check_coverage`
CLI command to return an error code.

## Requirements Challenge Areas

Extracting and tracking requirements for FHIR IGs can be difficult and time-
consuming, particularly when multiple versions of an IG are involved. The
Inferno requirements tools are stable and usable as is, but the Inferno team
has found the following aspects to be difficult to use in their current form:
- Conditionality: While the Inferno requirements format includes space for
  capturing conditionality, in pratice it is difficult to collect and define.
  The tooling does not currently use this information in any way, so it is
  safe to omit this detail.
- Sub-requirements: FHIR IGs often contain references to other IGs or parts
  of them. Turning these references, e.g., to a CapabilityStatement, into
  formal requirements lists requires careful interpretation.
- Decisions not to test a requirement: Currently, requirements can be marked
  as not tested at a global level, e.g., because they are malformed in some way.
  However, they cannot be marked as explicitly out of scope for a specific test
  kit.