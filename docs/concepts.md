---
title: Key Concepts
nav_order: 2
layout: docs
section: docs
---
# Key Concepts

## Inferno Core

Inferno Core is the primary library of Inferno, which testers can use to build Inferno Test
Kits. It provides the main logic of Inferno, as well as a command line interface (CLI), a web
interface for executing tests, and integration with data persistence layers and third-party
party validators. Conceptually, Inferno Core is similar to [Ruby on Rails](https://rubyonrails.org/) or
[React](https://react.dev/) + [create-react-app](https://create-react-app.dev/).

{% include figure.html 
    file="inferno-core.png"
    alt="Diagram of major components of Inferno Core"
    caption="Inferno Core provides essential components to execute Test Kits."
    description="The primary components include the connectivity with FHIR servers, the Inferno DSL, web and command line interfaces, database management, methods for reusing tests and managing the execution of test runs."
    maxwidth="466px"
%}


## Inferno DSL

The Inferno DSL is a Domain Specific Language (DSL) that test writers use to define the tests
in an Inferno Test Kit. The DSL provides built-in functionality that is
useful in testing FHIR APIs, such as a FHIR client and built-in assertion
libraries. See [Writing Tests](/docs/writing-tests/) for more information.

## Inferno Test Kit

An Inferno Test Kit is a distributable set of tests and tools built and packaged
using Inferno to help testers evaluate the conformance of a system to
base FHIR specification requirements, relevant FHIR Implementation
Guides, and any additional requirements. Test Kits are primarily composed of one
or more Test Suites, but may include other tools such as FHIR resource validators
or reference implementations.

{% include figure.html 
    file="inferno-test-kit.png"
    alt="Diagram of parts of a Test Kit"
    caption="Test Kits organize test suites, import Test Kits, and can include additional test tools."
    description="Test Kits can include reference implementations, FHIR Validators, test presets and options for complete customization"
    maxwidth="100%"
%}

## Inferno Template

The Inferno Template is a template for writing Inferno Test Kits. See [Template Layout](/docs/getting-started/repo-layout-and-organization) for more information.

{% include figure.html 
    file="inferno-template.png"
    alt="Diagram of Inferno Template"
    caption="The template for writing Test Kits includes Inferno Core and a skeleton file structure."
    description="The template provides scripts to run Test Kits using Inferno Core and reuse existing Test Kits."
    maxwidth="466px"
%}

   
## Inferno Test Suite

An Inferno Test Suite is an executable set of tests provided within an Inferno Test Kit that allows
testers to evaluate the conformance of a system. They can import tests from other Test Kits. 
Each Test Suite also defines how to interpret failures at the test level and in aggregate.
For example, a Test Suite may define that a conformant system will pass all provided
tests, or that the system may fail some tests. 

## Validators

Validators are tools that validate the correctness of a piece of data against a set of rules
defined within a context. Inferno tests typically fetch data and validate the
response using a validator, for example the FHIR Profile Validator or the FHIR Terminology
Validator. Inferno performs FHIR Resource Validation using the
the [HL7® FHIR Java Validator](https://github.com/hapifhir/org.hl7.fhir.core).

Depending on the nature of the tests, using a validator is not always required. Some tests
may simply need to confirm the presence of a response, or the absence of an error.
Inferno Test Kits support using custom or third-party validators, if necessary. See
[FHIR Resource Validation](/docs/writing-tests/fhir-validation.html) for more information.

## Reference Implementations

Reference implementations are example servers that implement all requirements from a
specification (e.g. FHIR) and demonstrates "correct" behavior. They can be useful to
develop tests against or to help interact with third-party solutions. For example, Inferno
has a [Reference Server](https://github.com/inferno-framework/inferno-reference-server)
for US Core and the Inferno ONC (g)(10) certification tests.

## Inferno Deployment

An Inferno Deployment is a web host running one or more Inferno Test Kits. One way to
do an Inferno Deployment is through [Inferno Platform](/docs/inferno-platforms.html),
an example of which is the
[https://inferno.healthit.gov](https://inferno.healthit.gov) website.
An individual Test Kit can also be run on users' local machines without any additional
configuration, see [Using Test Kits: Getting Started](/docs/getting-started-users.html)
for more information. Both setups include a web interface as well as
a RESTful API to enable third-party integration.

{% include figure.html 
    file="inferno-deployment.png"
    alt="Diagram of Inferno Deployment
    caption="A deployment combines Inferno Core and Test Kits into a running instance."
    description="Default services in a deployment include nginx, redis, validator services, web and command line interfaces, and database interfaces."
    maxwidth="100%"
%}

## Inferno Architecture Diagram

You can view an [Inferno Architecture Diagram (PDF 1.1 MB)](/download/Inferno_Architecture.pdf) which summarizes the components of Inferno Framework and includes a glossary of terms.
