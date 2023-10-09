---
title: Overview
nav_order: 1
layout: docs
section: about
---
# Overview

Welcome to Inferno, an open-source software testing framework for the Health Level 7 (HL7®) Fast
Healthcare Interoperability Resources (FHIR®) health API and data exchange standard.
The goal of Inferno is to accelerate the availability of interoperable Health IT
systems by providing easy to use, portable,
and comprehensive testing tools that can support implementation of
FHIR-based APIs.

Development of Inferno is principally sponsored by the Office of the National
Coordinator for Health IT (ONC) in support of the ONC Certified Health IT Program.
Development is currently led by the MITRE Corporation, a not-for-profit organization working in the
public interest.

## Background

Since 2018, MITRE has designed and developed a set of open-source testing tools, broadly named the Inferno Framework. Initially, this was 
in support of the ONC Health IT Certification Program, which was established to assess health IT capabilities for quality and consistency across certified products. This led to the development of the ONC Certification (g)(10) Standardized API Test Kit, an integrated set of tests that evaluates a system’s level of conformance to the §170.315(g)(10) criterion. This open-source Test Kit is freely available for download and is being used today by health IT developers who are preparing for certification to this criterion, as well as Accredited Test Labs (ATLs) that evaluate conformance for purposes of certification.  

While supporting the ONC Certification (g)(10) Standardized API Test Kit is an important part of Inferno, the Inferno Framework itself is a set of building blocks for testing FHIR-endabled data exchanges that can be used for a wide variety of use cases outside of this one Test Kit. Anyone can use Inferno to create Inferno Test Kits, which are standalone, portable test applications that are tailored to test specific FHIR-enabled data exchange use cases as described by FHIR Implementation Guides (IGs). The MITRE team developing Inferno not only supports current Test Kits and develops new Test Kits, but also works to develop common utilities that can be used across Test Kits.

## What is Inferno?

Inferno is framework for creating, executing, and sharing tests for health IT
systems providing standardized FHIR APIs. You use Inferno to create
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

This design enables users to build upon and extend Inferno Framework’s general-purpose FHIR testing functionality, allowing them to create and conduct tests within their use-case specific health data exchanges more effectively. Once an Inferno Test Kit has been created, it can be downloaded and used by implementers or test labs to easily evaluate conformance of FHIR APIs to the relevant IG. 

This project also includes Inferno Core, which provides common utilities for FHIR-based testing. Tests are not
limited to what is provided by Inferno Core, but rather it is a starting set of utilities provided for the benefit of the community.

Test Kits are Ruby applications built with the Inferno Core gem. While Ruby is sufficient for most testing needs,
Inferno Test Kits can include
other non-Ruby services as needed, and by default provides a Docker Compose
configuration to run and integrate with these services from within Inferno's
testing Domain Specific Language (DSL).

You can find more information about how Inferno works on [The Inferno Framework](/about/goals.html), and how to use Inferno in the [Documentation Section](/docs).

## Inferno Test Kits
All available Test Kits can be found on the [Community Page](/community/).

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

## Contact the Inferno Team
The fastest way to reach the Inferno team is via the [Inferno Zulip
stream](https://chat.fhir.org/#narrow/stream/179308-inferno). You can also
[e-mail the team](mailto:inferno@groups.mitre.org).
