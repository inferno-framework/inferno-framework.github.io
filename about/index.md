---
title: Overview
nav_order: 1
layout: docs
section: about
---
# About Inferno

Welcome to Inferno, an open-source software testing framework for the Health
Level 7 (HL7®) [Fast Healthcare Interoperability Resources
(FHIR®)](https://www.hl7.org/fhir/) standard for health care data exchange.

The goal of Inferno is to accelerate the availability of interoperable Health IT
systems by providing **easy to use**, **portable**, and **comprehensive testing
tools** that support interoperable implementations of FHIR-based systems.

## What is Inferno?

Inferno is a [Ruby](https://www.ruby-lang.org) application framework that test
authors can use to create fully automated tests for FHIR-based APIs. Inferno
tests are packaged within portable test applications called [Inferno Test
Kits](/docs/concepts.html#inferno-test-kit). Test Kits are tailored to test specific FHIR-enabled
data exchange use cases, typically described within one or more [FHIR
Implementation Guides](https://fhir.org/guides/registry/).

For more information on how to use Inferno to test your FHIR-enabled use case,
head over to the [Documentation](/docs) section.

For the list of all available Test Kits that have been created using Inferno,
check out the [Community](/community/) section.

## Background

MITRE began developing Inferno in 2018 as an open-source testing framework to
support the [ONC Health IT Certification
Program](https://www.healthit.gov/topic/certification-ehrs/about-onc-health-it-certification-program).
The program was created to evaluate health IT systems for compliance with
established standards and certification requirements.

The initial focus resulted in the [ONC Certification (g)(10) Standardized API
Test Kit](https://github.com/onc-healthit/onc-certification-g10-test-kit), which
tests system conformance to the [§170.315(g)(10)
criterion](https://www.healthit.gov/test-method/standardized-api-patient-and-population-services)
for standardized API functionality. This test kit is available as open-source
software and is currently used by health IT developers preparing for
certification and by Accredited Test Labs (ATLs) conducting conformance
evaluations.