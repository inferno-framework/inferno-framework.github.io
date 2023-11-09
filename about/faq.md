---
title: Frequently Asked Questions
nav_order: 10 
layout: docs
section: about
---

# Frequently Asked Questions


## Who maintains Inferno?

Development of Inferno is led by the Office of the National Coordinator for
Health IT and core components are implemented by the MITRE Corporation.
External participation and contributions are encouraged and welcome.  To learn
how to participate, visit the <a href="/community">Community</a> page of this
site.

## Does Inferno use the FHIR TestScript Resource?

Inferno does not currently use the standard <a
href="https://hl7.org/fhir/tesetscript.html">FHIR Testscript Resource</a> for
describing tests, and instead uses the Inferno Test DSL (Domain Specific
Language).

The Inferno Test DSL is designed to enable test writers to create high fidelity
simulated test clients that can serve as realistic data exchange partners for
FHIR APIs being tested. This allows for comprehensive conformance tests that
that have the flexibility to stay within any domain-specific constraints imposed
on clients by Implementation Guides. It also enables a higher level of testing
automation, as test writers can leverage a full-featured programming language
within the tests themselves.

TestScript expresses tests as a linear set of HTTP requests with expectations
attached to the request and response.  Conformance to an Implementation Guide
requires the definition of many separate TestScripts to test various data
exchanges defined within the FHIR Implementation Guide.  TestScripts can either
be used to drive a simulated client to evaluate the conformance of a FHIR API,
or to evaluate the conformance of data exchanges created by other clients and
servers.

In the base TestScript definition provided by the FHIR specification, only
simple client simulators can be implemented using TestScript, as there is no
support for conditional requests or looping constructs.  TestScripts can be
extended using platform-specific extensions to enable higher-fidelity simulated
clients, if that is needed to accomplish the test writer's testing goals.
However, using non-standard extensions within TestScripts negates some of the
value of TestScript, as scripts are no longer portable between testing systems
that have not implemented all of the same extensions.  Additionally, extensive
use of extensions to recreate features of a fully featured programming language
would result in a programming language that is expressed within the FHIR data
model, which would be counter-productive.

The Inferno approach is to describe tests within a full-featured programming
environment such that test developers can create low or high fidelity simulated
clients using the Ruby programming language.  The testing DSL provided attempts
to make simple tests written in Inferno to be approximately as easy to
understand as tests written in TestScript, but is designed to make it much
easier to add more complex logic as needed depending on testing goals.  Because
all test logic is incorporated into distributable test kits, anyone can download
and run Inferno tests regardless of the inclusion of custom logic or behavior.
No extensions need to be implemented on any platform that would like to run
Inferno tests.

Whether TestScript or Inferno's DSL is best in a given case largely depends on
the Implementation Guide, the goals of testing, and the preference of the test
writers.  The Inferno DSL currently does not provide broad support for client
testing, so those tests are best represented in TestScript or some other
approach.  For API testing, Inferno is optimized for testers that would like to
create realistic test clients with a high level of automation and that are
capable of performing complex behavior as defined in an Implementation Guide,
and who have some level of comfort or interest in writing simple programs.
TestScript is more optimized for situations where complex client behavior does
not need to be described in order to accomplish testing goals, but does
provide the opportunity to be extended as needed, understanding that using
extensions may negatively impact the value of using TestScript.

## Does Inferno test beyond US Core?

Yes, Inferno is able to test other Implementation Guides, though tests must
be written specific to these implementation guides.

Inferno was initially created to provide conformance testing for ONC's
Standardized API certification criterion.  This includes requiring conformance
to several FHIR implementation guides, include US Core.  Since US Core was the
first Implementation Guide, Inferno is best known for testing this implementation
guide, and is particularly well suited to support Implementation Guides
that also require conformance to US Core.

However, the goal of Inferno is to enable the creation of conformance tests
for a wide variety of FHIR Implementation Guides.

## How can I find Test Kits built with Inferno?

Visit our <a href="/community">Community</a> page to find Test Kits built with Inferno.

## Can I host my own Inferno server?

Inferno is specifically designed such that Inferno Test Kits can be run in any
environment that supports Docker, including on a desktop machine or
shared server.  For instructions on how to run a test kit locally or host them on a 
shared server, visit the <a href="/Docs">Documentation</a>.
