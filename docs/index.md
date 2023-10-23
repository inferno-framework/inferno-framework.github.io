---
title: Introduction
nav_order: 1
layout: docs
section: docs
---
# Introduction

## Overview
Inferno is an application framework for creating, executing, and sharing
conformance test for FHIR APIs. Inferno tests are packaged within portable test
applications called <a href="concepts.html#inferno-test-kit">Inferno Test Kits</a>.
Test Kits are tailored to test specific FHIR-enabled data exchange use cases,
typically described within one or more [FHIR Implementation
Guides](http://fhir.org/guides/registry/) (IGs).

For example:
* The [ONC Certification (g)(10) Standardized API Test Kit](https://github.com/onc-healthit/onc-certification-g10-test-kit)
  provides tests for systems that seek conformance to
  [ONC's Standardized API certification criterion](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services).
* The [US Core Test Kit](https://github.com/inferno-framework/us-core-test-kit)
  provides tests for servers implementing [US Core Implementation
  Guide](http://hl7.org/fhir/us/core/).
* The [SMART App Launch Test Kit](https://github.com/inferno-framework/smart-app-launch-test-kit)
  provides tests for systems that support the
  [SMART App Launch Framework](http://hl7.org/fhir/smart-app-launch/index.html).

If you would like to learn how to run or deploy an existing Inferno Test Kit, please visit
the <a href="getting-started-users.html">Using Test Kits</a> documentation.

A Test Kit is a standalone Ruby application that can be run on an end
user's machine, on a shared private host behind a firewall, or on a shared
public host such as [inferno.healthit.gov](https://inferno.healthit.gov/suites).
It is built with the [**Inferno Core**](https://github.com/inferno-framework/inferno-core) gem, which provides
several useful features for a FHIR testing application, including:

* **The Inferno DSL** - A domain specific language (DSL) for authoring FHIR API tests that
  includes a FHIR client, native Ruby classes for FHIR, and FHIR instance validators
* **API, Web and CLI Interfaces** - Multiple interface options for executing tests and
  retrieving results
* **Test Reuse** - Methods for reusing tests within a project or from other projects

Inferno Core provides common utilities for FHIR-based testing, but tests are not
limited to what is provided by Inferno Core.

Inferno's design reflects the flexibility provided by the base FHIR
specification. FHIR is a platform specification that is intended to provide support
across the whole healthcare process, so it relies on IGs to
provide enough specificity to enable meaningful interoperability between actors
for a given data exchange use case. FHIR IGs will typically
describe how to use relevant portions of the FHIR specification for
its use case while also providing additional rules not described in FHIR. There are no limits to what these additional rules may include; for example,
other standards can be required, such as
[OAuth](https://www.hl7.org/fhir/smart-app-launch/) or [QR Codes for Vaccination
Credentials](https://build.fhir.org/ig/HL7/fhir-shc-vaccination-ig/), as part of
their conformance criteria.

Creating a test system that is flexible enough to test any arbitrary
conformance criteria introduced in an IG is challenging.
Inferno accomplishes this by providing test authors with a full-featured
Ruby programming environment to define and run tests. It also allows the
use of the open source third-party libraries provided by Ruby.
This makes Inferno well-suited for testing IGs 
that:

* include additional standards beyond FHIR,
* have large specifications that could use from Ruby's meta-programming
  capabilities to ease maintenance burden,
* or require complex logic to thoroughly validate API responses.

While Ruby is sufficient for most testing needs, test developers may want to
include components that are not defined in Ruby. Inferno Test Kits can include
these non-Ruby services as needed, and by default provides a Docker Compose
configuration to run and integrate with these services from within Inferno's
testing DSL.

## Main Inferno Repositories
- [Inferno Core](https://github.com/inferno-framework/inferno-core) - The
  Inferno Ruby library. This repository that contains the code for defining
  and running tests and the command line and web interfaces. 
  This is the repository to use if you want to investigate or
  make changes to the internals of Inferno.
- [Inferno Template](https://github.com/inferno-framework/inferno-template) - A
  template for test writers. This is the repository to use if you want to write
  your own set of tests with Inferno.
- [FHIR Validator
  Wrapper](https://github.com/inferno-framework/fhir-validator-wrapper) - A
  simple web wrapper around the [official HL7 FHIR validation
  library](https://github.com/hapifhir/org.hl7.fhir.core/tree/master/org.hl7.fhir.validation).
  Inferno relies on this service to validate FHIR resources.

## Documentation Resources
- [JSON API Documentation](/inferno-core/api-docs) - The documentation for
  interacting with Inferno via a JSON API.
- [Inferno Ruby Documentation](/inferno-core/docs) - The documentation for
  Inferno's Ruby API.

## Inferno Test Kits
Visit the [Community Page](/inferno-core/available-test-kits) to view all available Test Kits.
