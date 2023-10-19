---
title: Overview
nav_order: 1
layout: docs
section: about
---
# Overview

Welcome to Inferno, an open source software testing framework for the Fast
Healthcare Interoperability Resources health API and data exchange standard.
Inferno's goal is to accelerate the availability of interoperable Health IT
systems connected using the FHIR standard by providing easy to use, portable,
and comprehensive test tools that can be used to support implementation of
FHIR-based APIs.

## The Inferno Approach

FHIR is a 'Framework Standard' that has great flexibility in how it might used to
facilitate .

For more information about how Inferno is constructed, visit the ... or get started
...

## How do you use Inferno


## Features and Functionality

The Inferno Framework 

## Using Inferno

Inferno was initially developed to provide certification tests  tool for the Office
of the National Coordinator for Ho

Development of Inferno is principally sponsored by the Office of the National
Coordinator for Health IT in support of the ONC Certified Health IT Program.
Development is currently led by the MITRE Corporation, a non profit working in the
public interest.

API for Patient and Population certification criterion. 

Inferno is used 

Recognizing the challenges in evaluating conformance of the Standardized API for
Patient and Population Services, and recognizing the value in providing open
source tools that can be used freely by implementers, test labs, test tool vendors, or other certificaiton programs, the lessons learned 

Inferno can be used in one of three 



Inferno is an testing application framework that is aimed at 
Inferno is sponsored by the Office of the National Coordinator for Health IT (ONC)
and principally developed by the MITRE Corporation with the goal of fostering
comprehensive testing solutions.

Inferno was initially designed to provide a testing solution for ONC's 
Standardized API Certification Criterion.

In recognition of effort involved in producing a comprehensive testing suite
for this use case.


What is Inferno?
Why Inferno?


Inferno is framework for creating, executing, and sharing tests for health IT
systems providing standardized FHIR APIs.



You use Inferno to create
**Inferno Test Kits** which are standalone, portable test applications that
are tailored to test specific FHIR-enabled data exchange use cases as described
in [FHIR Implementation Guides](http://fhir.org/guides/registry/).

Examples of test applications (Test Kits) built using Inferno include:
* The [US Core Test Kit](https://github.com/inferno-framework/us-core-test-kit)
  provides tests for servers implementing [US Core Implementation
  Guide](http://hl7.org/fhir/us/core/).
* The [SMART App Launch Test Kit](https://github.com/inferno-framework/smart-app-launch-test-kit)
  provides tests for systems that support the
  [SMART App Launch Framework](http://hl7.org/fhir/smart-app-launch/index.html).
* The [ONC Certification (g)(10) Standardized API Test Kit](https://github.com/onc-healthit/onc-certification-g10-test-kit)
  provides tests for systems that seek conformance to
  [ONC's Standardized API certification criterion](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services).

Each of these Test Kits is a standalone application that can be run on an end
user's machine, on a shared private host behind a firewall, or on a shared
public host such as [inferno.healthit.gov](https://inferno.healthit.gov/suites).
They are Ruby applications built with the **Inferno Core** gem which provides
several features useful for a FHIR testing application:

* **Inferno DSL**: A domain specific language for authoring FHIR API tests that
  includes a FHIR client, native Ruby classes for FHIR, and FHIR instance validators
* **API, Web and CLI Interfaces**: Multiple interfaces for executing tests and
  retrieving results
* **Test Reuse**: Methods for reusing tests within a project or from other projects

Inferno's design reflects the flexibility provided by the base FHIR
specification.  As a platform specification that is intended to provide support
across the whole healthcare process, FHIR relies on Implementation Guides to
provide enough specificity to enable meaningful interoperability between actors
for a given data exchange use case.  FHIR Implementation Guides typically will
describe how to use relevant portions of the FHIR specification for
its use case, while also providing additional rules that are not described
within FHIR itself.  There are no limits to what these rules may include, and
may even require the use of other standards, such as
[OAuth](https://www.hl7.org/fhir/smart-app-launch/) or [QR Codes for Vaccination
Credentials](https://build.fhir.org/ig/HL7/fhir-shc-vaccination-ig/), as part of
their conformance criteria.

Creating a test system that is flexible enough to test any arbitrary
conformance criteria introduced in Implementation Guides is challenging.
Inferno accomplishes this by providing test authors with a full featured
Ruby programming environment to define and run their tests, and doesn't restrict
usage of the rich ecosystem of open source third-party libraries provided by Ruby.
This makes Inferno well-suited for testing Implementation Guides 
that:

* include the use of additional standards beyond FHIR,
* have large specifications that could benefit from Ruby's meta-programming
  capabilities to ease maintenance burden,
* or require complex logic to thoroughly validate API responses.

Inferno Core provides common utilities for FHIR-based testing, but tests are not
limited to what is provided by Inferno Core.  Inferno Core's goal is to expand on
the set of common utilities it provides for the benefit of the community.

While Ruby is sufficient for most testing needs, Inferno Test Kits may also
include components that are not defined in Ruby.  Inferno Test Kits can include
other non-Ruby services as needed, and by default provides a Docker Compose
configuration to run and integrate with these services from within Inferno's
testing DSL.

## Documentation Resources
- View the [JSON API Documentation](/inferno-core/api-docs) for information on
  interacting with Inferno via a JSON API.
- View the [Inferno Ruby Documentation](/inferno-core/docs) for detailed
  information on Inferno's ruby api.

## Main Inferno Repositories
- [Inferno Core](https://github.com/inferno-framework/inferno-core) - The
  Inferno ruby library itself. This repository contains the code for defining
  and running tests, the command line and web interfaces, and this
  documentation. This is the repository to use if you want to investigate or
  make changes to the internals of Inferno.
- [Inferno Template](https://github.com/inferno-framework/inferno-template) - A
  template for test writers. This is the repository to use if you want to write
  your own set of tests with Inferno.
- [FHIR Validator
  Wrapper](https://github.com/inferno-framework/fhir-validator-wrapper) - A
  simple web wrapper around the [official HL7 FHIR validation
  library](https://github.com/hapifhir/org.hl7.fhir.core/tree/master/org.hl7.fhir.validation).
  Inferno relies on this service to validate FHIR resources.

## Inferno Test Kits
[See available Test Kits](/inferno-core/available-test-kits)

## Contact the Inferno Team
The fastest way to reach the Inferno team is via the [Inferno Zulip
stream](https://chat.fhir.org/#narrow/stream/179308-inferno). You can also
[e-mail the team](mailto:inferno@groups.mitre.org).
