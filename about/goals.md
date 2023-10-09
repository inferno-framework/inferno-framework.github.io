---
title: The Inferno Framework
nav_order: 2
layout: docs
section: about
---
# The Inferno Framework

## The Inferno Approach

**Goal of this section**: Elaborate on why we have taken the approach that we have for developing Inferno

Inferno's design reflects the flexibility provided by the base FHIR
specification. FHIR is a platform specification that is intended to provide support
across the whole healthcare process, and therefore relies on Implementation Guides (IGs) to
provide enough specificity to enable meaningful interoperability between actors
for a given data exchange use case. FHIR IGs typically describe how to use relevant portions of the FHIR specification for
its use case, while also providing additional rules that are not described
within FHIR itself. There are no limits to what these rules may include, and
may even require the use of other standards, such as
[OAuth](https://www.hl7.org/fhir/smart-app-launch/) or [QR Codes for Vaccination
Credentials](https://build.fhir.org/ig/HL7/fhir-shc-vaccination-ig/), as part of
their conformance criteria.

Creating a test system that is flexible enough to test any arbitrary
conformance criteria introduced in IGs is challenging.
Inferno accomplishes this by providing test authors with a full-featured
Ruby programming environment to define and run their tests, and does not restrict
usage of the rich ecosystem of open source third-party libraries provided by Ruby.
This makes Inferno well-suited for testing IGs that:

* include the use of additional standards beyond FHIR,
* have large specifications that could benefit from Ruby's meta-programming
  capabilities to ease maintenance burden,
* or require complex logic to thoroughly validate API responses.

Inferno Test Kits are standalone, portable test applications that are tailored to test specific FHIR-enabled data exchange use cases as described by FHIR IGs. Test Kits are intended to be developed and managed separately from the Inferno Framework, which allows development of tests to scale well beyond the capabilities of the team managing the Inferno Framework itself. While each Test Kit is managed separately, tests can be shared between them. As more Test Kits are created, the easier it becomes to build any successive Test Kit because there is a greater opportunity to leverage tests created by others.

The Inferno Test DSL is designed to enable test writers to create high fidelity
simulated test clients that can serve as realistic data exchange partners for
FHIR APIs being tested. This allows for comprehensive conformance tests that
that have the flexibility to stay within any domain-specific constraints imposed
on clients by Implementation Guides. It also enables a higher level of testing
automation, as test writers can leverage a full-featured programming language
within the tests themselves.

## Features and Functionality

**Goal of this section**: The main features and functionality of Inferno. This is somewhat covered in the Overview section but could go a little more in depth here if we want.

Inferno is built using open-source technologies and application development patterns that are well-understood by software engineers with experience in web or API development.  While the testing language used by Inferno to define tests is intended to be easy to read and write without a technical background, a certain amount of familiarity with these open-source technologies is assumed today in order to set up the Test Kit and to run them within a local environment. 

## The Inferno Architecture

**Goal of this section**: Explaining the architecture of the system, though this may be covered by the first section on this page? Depends how in depth we want to go here.

## Other possible sections

**Could have a section on FHIR itself? May be out of scope**

FHIR is a 'Framework Standard' that has great flexibility in how it might used to
facilitate .