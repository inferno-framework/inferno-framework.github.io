---
title: Testing Interface
nav_order: 22
section: docs
layout: docs
---
{:toc-skip: .h4 data-toc-skip=""}

# Using the Inferno Testing Interface

Inferno provides a web-based interface for configuring and running tests
included in a Test Kit.  

## Selecting a Test Suite (local installations)

For local installations, the initial screen will let use select a Test Suite to
run. Test Kits may include multiple Test Suites, and even import Test Suites
from other Test Kits.

{% include figure.html 
    file="test-suite-selection.png"
    alt="Inferno Core Test Suite selection dialog"
    caption="Inferno Core shows a dialog box which allows users to select the Test Suite they wish to run."
    maxwidth="666px"
%}

Select the name of the Test Suite you wish to run and click "Select Suite". 

{% include figure.html 
    file="test-suite-selected.png"
    alt="Inferno Core Test Suite selection dialog"
    caption="A selected Test Suite."
    maxwidth="400px"
%}


Some Test Suites may require selection of additional options. If so, you will
see another dialog to select options for the Test Suite, with a Test Suite
description. If you wish to select a different Test Suite, you may click on the
back arrow in the options dialog. Select the desired options and click "Start
Testing" to begin. 

{% include figure.html 
    file="test-suite-options.png"
    alt="Inferno Core Test Suite Options dialog"
    caption="An options dialog for the selected Test Suite"
    maxwidth="666px"
%}


## Main Test Interface

Once you have selected a Test Suite and Options, you are shown the main test
interface. The two main parts of the page are a sidebar and main test area. The
sidebar shows the various Test Groups, Report and Configuration links, and any
Presets available for the Test Suite. This lets you navigate to and run specific
Test Groups, without needing to run the entire Test Suite. 

{% include figure.html 
    file="test-suite-landing.png"
    alt="Inferno Core Test Suite main page"
    caption="Main page for viewing and running tests"
    maxwidth="666px"
%}

### Main Test Area

The majority of the page shows the description and tests included in the
selected Test Group. Clicking the expand arrow at the right of individual test
groups lets you see individual tests, and view details of test execution. 

{% include figure.html 
    file="test-details-expanded.png"
    alt="Inferno Core Test Details"
    caption="Expanded details view of individual tests"
    maxwidth="666px"
%}

Test Groups usually require various user-defined inputs, such as URLs for server
endpoints, authorization information and test options. Click the "Run Tests"
button at the top right of the Test Group in the main test area to open the test
options dialog. 

When all required options have been entered, click on "Submit" to begin testing.

{% include figure.html 
    file="test-inputs.png"
    alt="Inferno Core Test Details"
    caption="Expanded details view of individual tests"
    maxwidth="666px"
%}

Required inputs for testing may also be provided in JSON or YAML formats. This
is useful when you need to use the same set of inputs during testing, and avoids
the need to manually enter values using the fielded form inputs. 

{% include figure.html 
    file="test-inputs-json.png"
    alt="Inferno Core Test Inputs JSON Dialog"
    caption="Test Inputs may be provided in JSON or YML file formats"
    maxwidth="666px"
%}

Test Suites may also provide sets of default input values to be used in testing.
These sets are [Input Presets](/docs/advanced-test-features/input-presets.html)
and are listed in the Presets dropdown at the top of the sidebar. Selecting one
of the available presets will automatically populate the specified fields in the
Run Tests input dialog. 

{% include figure.html 
    file="preset-dropdown.png"
    alt="Inferno Core Test Inputs Preset Dropdown"
    caption="Test Inputs may be included in the Test Kit"
    maxwidth="666px"
%}

### Running Tests
When tests are executed, the status of each test is shown in an icon to the left
of the test. This indicates which tests have passed or failed.

{% include figure.html 
    file="test-execution-passed.png"
    alt="Test details shown with status icon"
    caption="Test status shown by icon next to test name"
    maxwidth="666px"
%}

The Help link at the top of the header will display a dialog with an icon
legend. You may also view a tooltip explaining each icon by hovering over the
icon. 

{% include figure.html 
    file="help-icon-legend.png"
    alt="Help icon legend dialog"
    caption="Help legend explains test status icons"
    maxwidth="666px"
%}

A progress indicator is shown during test execution, showing the number of the
current test being executed and the total number of tests in the group to be
run. 
{% include figure.html 
    file="progress-bar.png"
    alt="Test Group progress bar"
    caption="Progress bar shows text execution"
    maxwidth="666px"
%}

### Viewing Test Details
Clicking on the expand arrow for test groups and individual tests will display
additional details for each test. These include any messages, requests, inputs
and outputs, and a description of each test. 

{% include figure.html 
    file="test-details.png"
    alt="Screenshot of details pane for tests"
    caption="Detailed information about tests after execution"
    maxwidth="666px"
%}

Additional details of each may be viewed by clicking the "Details" button, where
another dialog lets you view the relevant details and values used in the test.
This is very useful when debugging tests or inspecting details of specific
servers or hosts being tested. 

{% include figure.html 
    file="test-request-details.png"
    alt="Screenshot of test request detail dialog"
    caption="Detailed information about requests made by a test after execution"
    maxwidth="666px"
%}

Icons displayed to the right of individual tests indicate if the test made
requests or produced messages. Expand the details of the test to view the
specifics about requests or messages. 
{% include figure.html 
    file="test-request-icon.png"
    alt="Screenshot of test request icon"
    caption="Icons indicate tests which made requests"
    maxwidth="666px"
%}


## Testing Report

At any time, you may view a summary report of the test execution status.
Clicking on "Report" in the sidebar will display a summary report page, with
all tests in the Test Suite listed with the icon indicating the status of each.

{% include figure.html 
    file="report-view.png"
    alt="Screenshot of test report view"
    caption="Report view gives overall summary of testing status"
    maxwidth="666px"
%}

Clicking the "Show Details" toggle switch at the top of the report will expand
those tests with Messages or Requests and include those details in the report. 
{% include figure.html 
    file="report-details-view.png"
    alt="Screenshot of test report details view"
    caption="Details view shows additional test information"
    maxwidth="666px"
%}

## Shared Test Sessions

Individual test sessions may be shared using the "Share Session" button in the
test area header. This menu provides a way to share a link to an existing test
session (with users who have access to the instance of Inferno). A 'read-only'
link may be sent to users, allowing them to view an existing test session but
not to make changes to test inputs or to run the tests. 
{% include figure.html 
    file="share-session-link.png"
    alt="Screenshot of share session dropdown"
    caption="Share links for test sessions"
    maxwidth="666px"
%}

## Viewing Verified Requirements

Inferno provides a way for test developers to [associate requirements](/docs/advanced-test-features/requirements.html)
with suites and specific groups and tests within them. When test developers
choose to do this, it provides testers with a detailed view of 
- Discrete requirements targeted by the suite and which of them are verified
  through the "Specification Requirements" page, and 
- Which requirements the tests and groups in the suite verify through "View
  Specification Requirements" links in test, group, and suite documentation
  panels.

**Specification Requirements**

Clicking on "Specification Requirements" in the sidebar will display a list
of all the requirements associated with the test suite. Each entry
represents a discrete requirement that a relevant specification or regulation
places on the tested system.

{% include figure.html 
    file="specification-requirements.png"
    alt="Screenshot of the specification requirements page"
    caption="The specification requirements page"
    maxwidth="666px"
%}

The requirements page groups requirements based on their definition location.
The top of each group includes the requirement set identifier and a link that
can be used to see the original source. 

{% include figure.html 
    file="requirements-group-header.png"
    alt="Screenshot of a requirements group header"
    caption="Requirements are grouped by their source requirement set and definition link"
    maxwidth="666px"
%}

For each individual requirement in the group, Inferno displays
- *The requirement identifier*. This will either be an identifier defined by
  the requirement source if one exists, or one generated by Inferno.
- *The strength of the requirement*, expressed as a [FHIR conformance verb](https://hl7.org/fhir/R4/conformance-rules.html#conflang), where **SHALL** means required, **SHOULD** means recommended,
  and **MAY** means optional.
- *The requirement text*. Note that the text will often have been edited for
  clarity with additional context added indicated through square brackets
  and locations where text was removed indicated through an ellipsis.
- *Where the requirement is verified*, expressed as a list of links to the
  locations in the suite that verify the requirement, or "Not Tested" if the
  requirement is not currently verified. If there are multiple tests listed,
  testers should assume that all linked tests must pass for the requirement to
  be considered met by the tested system.

{% include figure.html 
    file="requirement-entry.png"
    alt="Screenshot of a single requirement entry"
    caption="A single requirement verified by 3 tests"
    maxwidth="666px"
%}

The page provides dropdowns that allow testers to filter the displayed
requirements by the requirement set identifier and/or the conformance verb.

{% include figure.html 
    file="requirements-filters.png"
    alt="Screenshot of the requirement filtering dropdown"
    caption="Requirements filtered by Conformance verb"
    maxwidth="666px"
%}

**Test-specific Requirements Display**

Test, Groups, and Suites that verify specific requirements will include a
"View Specification Requirements" link at the bottom right of their
documentation.

{% include figure.html 
    file="view-specification-requirements.png"
    alt="Screenshot of a View Specification Requirements link"
    caption="Access verified requirements through the View Specification Requirements link"
    maxwidth="666px"
%}

Clicking on this link will bring up a display of the requirements completely or
partially verified when Inferno deems it to have passed.

{% include figure.html 
    file="test-verified-requirements.png"
    alt="Screenshot of tested requirements dialog"
    caption="A requirement verified by a specific test"
    maxwidth="666px"
%}

This display is similar to the "Specification Requirements" page, but
- Includes only requirements verified by the selected test, group, or suite.
- Does not include the list of all tests that verify the requirement.
- Does not include filter capabilities.

Note that
- A passing test does not necessarily indicate conformance to all associated
  requirements: if the requirement is associated with multiple tests, the
  verification performed by each test may only be partial.
- Other requirements may be verified by tests or groups under the selected
  group or suite. Verified requirements are not rolled up and listed in the
  parent's list of verified requirements because a passing parent does not
  necessarily imply a passing child (e.g., for optional tests).