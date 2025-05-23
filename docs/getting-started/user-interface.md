---
title: Using Inferno Core Interface
nav_order: 11
parent: Getting Started
section: docs
layout: docs
---
{:toc-skip: .h4 data-toc-skip=""}

# Using Inferno Core Interface

Inferno Core provides a web-based interface for configuring and running tests included in a Test Kit. If you have installed Inferno Core and your Test Kit locally, you can navigate to `http://localhost:4567` to access the Inferno Core interface.

## Selecting a Test Suite

The initial screen will let use select a Test Suite to run. Test Kits may include multiple Test Suites, and even import additional Test Kits. The primary Test Suite of the main Test Kit will be shown at the top of the dialog. 

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


Some Test Suites may require selection of additional options. If so, you will see another dialog to select options for the Test Suite, with a Test Suite description. If you wish to select a different Test Suite, you may click on the back arrow in the options dialog. Select the desired options and click "Start Testing" to begin. 

{% include figure.html 
    file="test-suite-options.png"
    alt="Inferno Core Test Suite Options dialog"
    caption="An options dialog for the selected Test Suite"
    maxwidth="666px"
%}


## Main Test Interface

Once you have selected a Test Suite and Options, you are shown the main test interface. The two main parts of the page are a sidebar and main test area. The sidebar shows the various Test Groups, Report and Configuration links, and any Presets available for the Test Suite. This lets you navigate to and run specific Test Groups, without needing to run the entire Test Suite. 

{% include figure.html 
    file="test-suite-landing.png"
    alt="Inferno Core Test Suite main page"
    caption="Main page for viewing and running tests"
    maxwidth="666px"
%}

### Main Test Area

The majority of the page shows the description and tests included in the selected Test Group. Clicking the expand arrow at the right of individual test groups lets you see individual tests, and view details of test execution. 

{% include figure.html 
    file="test-details-expanded.png"
    alt="Inferno Core Test Details"
    caption="Expanded details view of individual tests"
    maxwidth="666px"
%}

Test Groups usually require various user-defined inputs, such as URLs for server endpoints, authorization information and test options. Click the "Run Tests" button at the top right of the Test Group in the main test area to open the test options dialog. 

When all required options have been entered, click on "Submit" to begin testing.

{% include figure.html 
    file="test-details-expanded.png"
    alt="Inferno Core Test Details"
    caption="Expanded details view of individual tests"
    maxwidth="666px"
%}

Required inputs for testing may also be provided in JSON or YAML formats. This is useful when you need to use the same set of inputs during testing, and avoids the need to manually enter values using the fielded form inputs. 

{% include figure.html 
    file="test-inputs-json.png"
    alt="Inferno Core Test Inputs JSON Dialog"
    caption="Test Inputs may be provided in JSON or YML file formats"
    maxwidth="666px"
%}

Test Suites may also provide sets of default input values to be used in testing. These sets are [Input Presets](/docs/advanced-test-features/input-presets.html) and are listed in the Presets dropdown at the top of the sidebar. Selecting one of the available presets will automatically populate the specified fields in the Run Tests input dialog. 

{% include figure.html 
    file="preset-dropdown.png"
    alt="Inferno Core Test Inputs Preset Dropdown"
    caption="Test Inputs may be included in the Test Kit"
    maxwidth="666px"
%}

### Running Tests
When tests are executed, the status of each test is shown in an icon to the left of the test. This indicates which tests have passed or failed.

{% include figure.html 
    file="test-execution-passed.png"
    alt="Test details shown with status icon"
    caption="Test status shown by icon next to test name"
    maxwidth="666px"
%}

The Help link at the top of the header will display a dialog with an icon legend. You may also view a tooltip explaining each icon by hovering over the icon. 

{% include figure.html 
    file="help-icon-legend.png"
    alt="Help icon legend dialog"
    caption="Help legend explains test status icons"
    maxwidth="666px"
%}

A progress indicator is shown during test execution, showing the number of the current test being executed and the total number of tests in the group to be run. 
{% include figure.html 
    file="progress-bar.png"
    alt="Test Group progress bar"
    caption="Progress bar shows text execution"
    maxwidth="666px"
%}

### Viewing Test Details
Clicking on the expand arrow for test groups and individual tests will display additional details for each test. These include any messages, requests, inputs and outputs, and a description of each test. 

{% include figure.html 
    file="test-details.png"
    alt="Screenshot of details pane for tests"
    caption="Detailed information about tests after execution"
    maxwidth="666px"
%}

Additional details of each may be viewed by clicking the "Details" button, where another dialog lets you view the relevant details and values used in the test. This is very useful when debugging tests or inspecting details of specific servers or hosts being tested. 

{% include figure.html 
    file="test-request-details.png"
    alt="Screenshot of test request detail dialog"
    caption="Detailed information about requests made by a test after execution"
    maxwidth="666px"
%}

Icons displayed to the right of individual tests indicate if the test made requests or produced messages. Expand the details of the test to view the specifics about requests or messages. 
{% include figure.html 
    file="test-request-icon.png"
    alt="Screenshot of test request icon"
    caption="Icons indicate tests which made requests"
    maxwidth="666px"
%}


## Testing Report

At any time, you may view a summary report of the test execution status. Clicking on "Report" the sidebar will display a summary report page, with all tests in the Test Suite listed with the icon indicating the status of each. 

{% include figure.html 
    file="report-view.png"
    alt="Screenshot of test report view"
    caption="Report view gives overall summary of testing status"
    maxwidth="666px"
%}

Clicking the "Show Details" toggle switch at the top of the report will expand those tests with Messages or Requests and include those details in the report. 
{% include figure.html 
    file="report-details-view.png"
    alt="Screenshot of test report details view"
    caption="Details view shows additional test information"
    maxwidth="666px"
%}

## Shared Test Sessions

Individual test sessions may be shared using the "Share Session" button in the test area header. This menu provides a way to share a link to an existing test session (with users who have access to the instance of Inferno). A 'read-only' link may be sent to users, allowing them to view an existing test session but not to make changes to test inputs or to run the tests. 
{% include figure.html 
    file="share-session-link.png"
    alt="Screenshot of share session dropdown"
    caption="Share links for test sessions"
    maxwidth="666px"
%}



