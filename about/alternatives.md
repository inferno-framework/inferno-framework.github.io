---
title: Alternatives to Inferno
nav_order: 3
layout: docs
section: about
---
# Alternatives to Inferno

## Touchstone

**Goal of this section**: Explain what Touchtone is, how it is used, and compare it to Inferno

Touchstone is an Infrastructure as a Service (IaaS) and Testing as a Service (TaaS) Open Access Solution for health information exchange.

You can find more information about Touchstone [here](https://touchstone.aegis.net/touchstone/).

## FHIR TestScript Resource

The [FHIR TestScript Resource](https://www.hl7.org/fhir/testscript.html) is part of the FHIR standard that can be used to define tests that are executed against one or more FHIR clients and servers. It expresses tests as a linear set of HTTP requests with expectations
attached to the request and response. Conformance to an Implementation Guide (IG)
requires the definition of many separate TestScripts to test various data
exchanges defined within the FHIR IG. TestScripts can either
be used to drive a simulated client to evaluate the conformance of a FHIR API,
or to evaluate the conformance of data exchanges created by other clients and
servers.

In the base TestScript definition provided by the FHIR specification, only
simple client simulators can be implemented using TestScript, as there is no
support for conditional requests or looping constructs. TestScripts can be
extended using platform-specific extensions to enable higher-fidelity simulated
clients, if that is needed to accomplish the test writer's testing goals.
However, using non-standard extensions within TestScripts negates some of the
value of TestScript, as scripts are no longer portable between testing systems
that have not implemented all of the same extensions. Additionally, extensive
use of extensions to recreate features of a fully featured programming language
would result in a programming language that is expressed within the FHIR data
model, which would be counter-productive.

In comparison, the Inferno approach is to describe tests within a full-featured programming
environment so that test developers can create low or high fidelity simulated
clients using the Ruby programming language. The testing Domain Specific Language (DSL) attempts
to make simple tests written in Inferno to be approximately as easy to
understand as tests written in TestScript, but is also designed to make it much
easier to add more complex logic as needed. Additionally, because
all test logic is incorporated into distributable Test Kits, anyone can download
and run Inferno tests regardless of the inclusion of custom logic or behavior.
No extensions need to be implemented on any platform that would like to run
Inferno tests.

Whether TestScript or Inferno's DSL is best in a given case largely depends on
the IG, the goals of testing, and the preference of the test
writers. The Inferno DSL currently does not provide broad support for client
testing, so those tests are best represented in TestScript or some other
approach. For API testing, Inferno is optimized for testers that would like to
create realistic test clients with a high level of automation and that are
capable of performing complex behavior as defined in an IG,
and who have some level of comfort or interest in writing simple programs.
TestScript is more optimized for situations where complex client behavior does
not need to be described in order to accomplish testing goals, but does
provide the opportunity to be extended as needed, with the understanding that using
extensions may negatively impact the value of using TestScript.