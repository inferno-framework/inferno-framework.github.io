---
title: Test Kit Metadata
nav_order: 4
parent: Getting Started
section: docs
layout: docs
---

# Test Kit Metadata
Test kit metadata is defined in `lib/{YOUR_TEST_KIT_NAME}/metadata.rb`. This
information is used to populate the test kit page which is displayed when
starting Inferno.

For example, the metadata for the SMART App Launch Test Kit looks like this:

```ruby
require_relative 'version'

module SMARTAppLaunch
  class Metadata < Inferno::TestKit
    id :smart_app_launch_test_kit
    title 'SMART App Launch Test Kit'
    description <<~DESCRIPTION
      The SMART App Launch Test Kit validates the conformance of authorization server
      implementations and clients that interact with them to a specified version of the
      [SMART Application Launch Framework Implementation
      Guide](http://hl7.org/fhir/smart-app-launch/index.html).  This Test Kit also
      provides Brand Bundle Publisher testing for the User-access Brands and Endpoints
      specification.  This Test Kit supports following versions of the SMART App
      Launch IG: [STU1](https://hl7.org/fhir/smart-app-launch/1.0.0/),
      [STU2](http://hl7.org/fhir/smart-app-launch/STU2/), and
      [STU2.2](http://hl7.org/fhir/smart-app-launch/STU2.2/).
      <!-- break -->

      This Test Kit is [open
      source](https://github.com/inferno-framework/smart-app-launch-test-kit#license)
      and freely available for use or adoption by the health IT community including
      EHR vendors, health app developers, and testing labs. It is built using the
      [Inferno Framework](https://inferno-framework.github.io/inferno-core/). The
      Inferno Framework is designed for reuse and aims to make it easier to build test
      kits for any FHIR-based data exchange.
  
      ...
    DESCRIPTION
    suite_ids [:smart, :smart_stu2, :smart_stu2_2, :smart_access_brands, :smart_client_stu2_2]
    tags ['SMART App Launch', 'Endpoint Publication']
    last_updated LAST_UPDATED
    version VERSION
    maturity 'Medium'
    authors ['Stephen MacVicar', 'Karl Naden']
    repo 'https://github.com/inferno-framework/smart-app-launch-test-kit'
  end
end
```

`VERSION` and `LAST_UPDATED` are defined in `version.rb`:
```ruby
module SMARTAppLaunch
  VERSION = '0.6.4'.freeze
  LAST_UPDATED = '2025-06-25'.freeze
end
```

Its test kit page looks like this:

{% include figure.html 
    file="test-kit-page-example.png"
    alt="Inferno Core Test Kit page example"
    caption="Test kit page for the SMART App Launch Test Kit with a description and suite selection options"
    maxwidth="1210px"
%}
