---
title: Inferno Add-ons
nav_order: 13
layout: docs
section: community
---

## Inferno Test Kit Add-ons

The primary component of an Inferno Test Kit is the Inferno Test Suites, which are
executable tests that are run using the Inferno Core library.  However,
Test Kits can package any other set of utilities or services as deemed relevant
to the testing case.  Over time, we would like to expand the list of available
plug-and-play utilities that test authors can package into their Test Kits.

See below for components that have been developed thus far and are available for reuse.
Note that these may require additional effort to integrate into Test Kits.

* **[Inferno US Core Reference
  Server](https://github.com/inferno-framework/inferno-reference-server)**:
  Simulated FHIR API server pre-loaded with US Core data and authorized by a
  simulated SMART App Launch/OAuth 2.0 Authorization server ([hosted example](https://inferno.healthit.gov/reference-server)). This is a simulated API that is useful for
  demonstrating successful tests to users of the (g)(10) Standardized API Test Kit.
