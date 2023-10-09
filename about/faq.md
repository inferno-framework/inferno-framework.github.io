---
title: Frequently Asked Questions
nav_order: 4
layout: docs
section: about
---

# Frequently Asked Questions


#### Who maintains Inferno?

Development of Inferno is led by the Office of the National Coordinator for
Health IT and core components are implemented by the MITRE Corporation.
External participation and contributions are encouraged and welcome.  To learn
how to participate, visit the <a href="/community">Community</a> page of this
site.

#### Does Inferno use the FHIR TestScript Resource?

Inferno does not currently use the standard <a
href="https://hl7.org/fhir/tesetscript.html">FHIR Testscript Resource</a> for
describing tests, and instead uses the Inferno Test DSL (Domain Specific
Language).

You can read more information on the FHIR TestScript Resource and why Inferno does not currently use it on our [Alternatives to Inferno Page](/about/alternatives.html).

#### Does Inferno test beyond US Core?

Yes, Inferno is able to test other Implementation Guides (IGs), though tests must
be written specific to these IGs.

Inferno was initially created to provide conformance testing for ONC's
Standardized API certification criterion. This included requiring conformance
to several FHIR IGs, include US Core. Since US Core was the
first IG, Inferno is best known for testing this IG, and Inferno is particularly well suited to support IGs
that also require conformance to US Core, but the goal of Inferno is to enable the creation of conformance tests
for a wide variety of FHIR IGs.

#### How can I find Test Kits built with Inferno?

Visit our <a href="/community">Community</a> page to find Test Kits built with Inferno.

#### Can I host my own Inferno server?

Inferno is specifically designed such that Inferno Test Kits can be run in any
environment that supports Docker, including on a desktop machine or
shared server.  For instructions on how to run a test kit locally or host them on a 
shared server, visit the <a href="/Docs">Documentation</a>.
