---
title: Properties
nav_order: 2
parent: Writing Tests
layout: docs
section: docs
---
# Test, Group & Suite Properties

## Title
**Description**: The title which is displayed in the UI.

**Can be Used In**: `Test`, `Group`, `Suite`

**Example**:
```ruby
test do
  title 'US Core Patient Read Interaction'
end
```
**Reference**: [`title` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#title-instance_method)

----
## Short Title
**Description**: A short title which is displayed in the left side of the UI.

**Can be Used In**: `Test`, `Group`, `Suite`

**Example**:
```ruby
group do
  short_title 'Patient Tests'
end
```
**Reference**: [`short_title` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#short_title-instance_method)

----
## Id
**Description**: A unique identifier. Inferno will automatically create
ids if they are not specified. It is important to create ids yourself if you
need to refer to a test or group elsewhere.

**Can be Used In**: `Test`, `Group`, `Suite`

**Example**:
```ruby
test do
  id :us_core_patient_read
end

group do
  test from: :us_core_patient_read
end
```

**Additional Notes**: TestSuite ids appear in Inferno's urls, so consideration should be given to
choosing a suite id that will make sense to users as a url path. Links to a test
suite take the form of `INFERNO_BASE_PATH/TEST_SUITE_ID`, and individual test
session urls look like `INFERNO_BASE_PATH/TEST_SUITE_ID/TEST_SESSION_ID`.

**Reference**: [`id` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#id-instance_method)

----
## Short Id
**Description**: A short numeric id or sequence number which is displayed
in the left side of the UI before short title. This attribute is read only
and is automatically assigned.

**Can Be Used In**: `Test`, `Group`

**Example**:
```ruby
require 'us_core_test_kit'
USCoreTestKit::USCoreV610::USCoreTestSuite.groups.first.short_id  # => "1"
```

**Reference**: `short_id` in API docs for [Test](https://inferno-framework.github.io/inferno-core/docs/Inferno/Entities/Test.html#short_id-class_method)
and [TestGroup](https://inferno-framework.github.io/inferno-core/docs/Inferno/Entities/TestGroup.html#short_id-class_method).

----
## Description
**Description**: A detailed description displayed in the UI.
[Markdown](https://commonmark.org/help/) is supported. The description usually
requires multiple lines, and the example below shows different ways to
define long strings in Ruby.

**Can be Used In**: `Test`, `Group`, `Suite`

**Example**:
```ruby
test do
  description 'This is a brief description'

  description 'This is a longer description. There are several ways to split ' \
              'it up over multiple lines, and this is one of the worst ways.'

  description <<~DESCRIPTION
    This is another long description. This is an ok way to represent a long
    string in ruby.
  DESCRIPTION

  description %(
    This is another long description. This is a pretty good way to represent a
    long string in ruby.
  )
end
```
**Reference**: [`description` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#description-instance_method)

----
## Optional/Required
**Description**: Mark a test or group as optional/required. Tests and Groups are required by default.
The results of optional tests do not affect the test result of their parent.

**Can Be Used In**: `Test`, `Group`

**Example**:
```ruby
group do
  optional # Makes this group optional

  test do
    optional # Makes this test optional
  end

  test from: :some_optional_test do
    required # Make an optional test required
  end
end
```
**Reference**: [`optional` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#optional-instance_method),
[`required` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#required-instance_method)

----
## Run
**Description**: `run` defines a block of code to execute when the test is
run. A test will typically make one or more
[assertions](/inferno-core/docs/Inferno/DSL/Assertions.html). If no assertions fail, then the
test passes.

**Can Be Used In**: `Test`

**Example**:
```ruby
test do
  run do
    assert 1 == 0, 'One is not equal to zero'
  end
end
```
**Reference**: [`run` in the API
docs](/inferno-core/docs/Inferno/Entities/Test.html#block-class_method)

----
## Version
**Description**: Define the suite's version, which is displayed in the UI.

**Can Be Used In**: `Suite`

**Example**:
```ruby
class MySuite < Inferno::TestSuite
  version '1.2.3'
end
```
**Reference**: [`version` in the API
docs](/inferno-core/docs/Inferno/Entities/TestSuite.html#version-class_method)

----
## Input Instructions
**Description**:
Define additional instructions which will be displayed above a runnable's
inputs. These instructions only appear when running this particular runnable.
They will not appear if you run a parent or child of this runnable.
[Markdown](https://commonmark.org/help/) is supported.

**Can Be Used In**: `Test`, `Group`, `Suite`

**Example**:
```ruby
group do
  input_instructions %(
    Register Inferno as a standalone application using the following information:

    * Redirect URI: `#{SMARTAppLaunch::AppRedirectTest.config.options[:redirect_uri]}`

    Enter in the appropriate scope to enable patient-level access to all
    relevant resources. If using SMART v2, v2-style scopes must be used. In
    addition, support for the OpenID Connect (openid fhirUser), refresh tokens
    (offline_access), and patient context (launch/patient) are required.
  )
end
```
**Reference**: [`input_instructions` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#input_instructions-instance_method)

----
## Run as Group
**Description** `run_as_group` makes a group run as a single unit. When true,
users will not be able to run any of the group's children individually. They
will only be able to run the whole group at once.

**Can Be Used In**: `Group`

**Example**:
```ruby
group do
  run_as_group

  # These tests can not be run individually
  test do
    # ...
  end

  test do
    # ...
  end
end
```
**Reference**: [`run_as_group` in the API
docs](/inferno-core/docs/Inferno/Entities/TestGroup.html#run_as_group-class_method)

----
## Suite Option
**Description** Define a user-selectable option for a suite. See [Suite
Options
documentation](/docs/advanced-test-features/test-configuration#suite-options).

**Can Be Used In**: `Suite`

**Example**:
```ruby
class MyTestSuite < Inferno::TestSuite
  suite_option :smart_app_launch_version,
               title: 'SMART App Launch Version',
               list_options: [
                 {
                   label: 'SMART App Launch 1.0.0',
                   value: 'smart_app_launch_1'
                 },
                 {
                   label: 'SMART App Launch 2.0.0',
                   value: 'smart_app_launch_2'
                 }
               ]
end
```
**Reference**: [`suite_option` in the API
docs](/inferno-core/docs/Inferno/Entities/TestSuite.html#suite_option-class_method)

----
## Required Suite Options
**Description**: Define the suite options that must be selected
in order for a runnable to be included in the current session. See [Hiding Tests
Based on Suite
Options](/docs/advanced-test-features/test-configuration#hiding-tests-based-on-suite-options).

**Can Be Used In**: `Test`, `Group`

**Example**:
```ruby
class MyTestSuite < Inferno::TestSuite
  # suite_option :smart_app_launch_version,
  # ...

  # Suite option requirements can be defined inline
  group from: :smart_app_launch_v1,
        required_suite_options: {
          smart_app_launch_version: 'smart_app_launch_1'
        }

  # Suite option requirements can be defined within a test/group definition
  group from: :smart_app_launch_v2 do
    required_suite_options smart_app_launch_version: 'smart_app_launch_2'
  end
end
```
**Reference**: [`required_suite_options` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#required_suite_options-instance_method)

----
## Links
**Description**: Define a list of links which are displayed in the footer of
the UI.

**Can Be Used In**: `Suite`

**Example**:
```ruby
class MyTestSuite < Inferno::TestSuite
  links [
    {
      type: 'report_issue',
      label: 'Report Issue',
      url: 'https://github.com/onc-healthit/onc-certification-g10-test-kit/issues/'
    },
    {
      type: 'source_code',
      label: 'Open Source',
      url: 'https://github.com/onc-healthit/onc-certification-g10-test-kit/'
    }
  ]
end
```
**Reference**: [`links` in the API
docs](/inferno-core/docs/Inferno/DSL/Links.html#links-instance_method)

----
## add_link / source_code_url / ig_url / download_url / report_issue_url

**Description**: Convenience methods to add links to the suite footer.

**Can Be Used In**: `Suite`

**Example**:
```ruby
class MyTestSuite < Inferno::TestSuite
  source_code_url 'https://github.com/example/source'
  ig_url 'https://hl7.org/fhir/us/core/'
  download_url 'https://example.com/download'
  report_issue_url 'https://github.com/example/issues'
  add_link 'custom', 'Custom Link', 'https://example.com'
end
```
**Reference**: [`Links DSL` in the API
docs](/inferno-core/docs/Inferno/DSL/Links.html)

----
## Suite Summary
**Description**: Define a summary to display on the suite options
selection page. If the suite has no options, the summary is not used. If no
suite summary is defined, the description will be displayed on the options
selection page. [Markdown](https://commonmark.org/help/) is supported.

**Can Be Used In**: `Suite`

**Example**:
```ruby
class MyTestSuite < Inferno::TestSuite
  suite_summary %(
    This is a brief description of the suite which will be displayed on the
    suite options selection page.
  )
end
```
**Reference**: [`suite_summary` in the API
docs](/inferno-core/docs/Inferno/Entities/TestSuite.html#suite_summary-class_method)

----
## Config
**Description**: Configure a runnable and its descendants. For more information, see
[Configuration](/docs/advanced-test-features/test-configuration#configuration).

**Can Be Used In**: `Suite`

**Reference**: [`config` in the API
docs](/inferno-core/docs/Inferno/DSL/Configurable.html#config-instance_method)

----
## Reorder
**Description**: Move a child test or group to a new position. For more information, see
[Reordering Children](/docs/advanced-test-features/test-configuration#reordering-children).

**Can Be Used In**: `Suite`, `Group`

**Reference**: [`reorder` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#reorder-instance_method)

----
## Replace
**Description**: Replace a child test or group with another. For more information, see
[Replacing Children](/docs/advanced-test-features/test-configuration#replacing-children).

**Can Be Used In**: `Suite`, `Group`

**Reference**: [`replace` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#replace-instance_method)

----
## Remove
**Description**: Remove a child test or group by ID. For more information, see
[Removinging Children](/docs/advanced-test-features/test-configuration#removing-children).

**Can Be Used In**: `Suite`, `Group`

**Reference**: [`remove` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#remove-instance_method)

