---
title: Overview
nav_order: 1
layout: docs
section: about
---
# About Inferno

Welcome to Inferno, an open-source software testing framework for the Health Level 7 (HL7®) [Fast
Healthcare Interoperability Resources (FHIR®)](https://www.hl7.org/fhir/) standard for health care data exchange.
{: .lead }
The goal of Inferno is to accelerate the availability of interoperable Health IT
systems by providing **easy to use**, **portable**,
and **comprehensive testing tools** that support interoperable implementations of FHIR-based systems.
{: .lead }

## What is Inferno?

Inferno is a [Ruby](https://www.ruby-lang.org) application framework that test
authors can use to create fully automated tests for FHIR-based APIs. Inferno tests are packaged within portable test applications called [Inferno Test Kits](/docs/concepts.html). Test Kits are tailored to test specific FHIR-enabled data exchange use cases, typically described within one or more [FHIR Implementation Guides](https://fhir.org/guides/registry/).

For more information on how to use Inferno to test your FHIR-enabled use case, head over to the
[Documentation](/docs) section.

For the list of all available Test Kits that
have been created using Inferno, check out the
[Community](/community/) section.

## Background

Since 2018, MITRE has designed and developed a set of open-source testing tools, broadly named Inferno. Initially, this was 
in support of the ONC Health IT Certification Program, which was established to assess health IT capabilities for quality and consistency across certified products. This led to the development of the ONC Certification (g)(10) Standardized API Test Kit, an integrated set of tests that evaluates a system’s level of conformance to the §170.315(g)(10) criterion. This open-source Test Kit is freely available for download and is being used today by health IT developers who are preparing for certification to this criterion, as well as Accredited Test Labs (ATLs) that evaluate conformance for purposes of certification.