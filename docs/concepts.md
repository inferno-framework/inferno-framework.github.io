---
title: Key Concepts
nav_order: 2
layout: docs
section: docs
---
# Key Concepts

## Inferno Core

Inferno Core is the primary library of Inferno, which testers can use to build Inferno Test
Kits. It provides the main logic of Inferno, as well as a CLI, a web
interface for executing tests, and integration with data persistence layers and 3rd
party validators. Conceptually, Inferno Core is similar to Ruby on Rails or
React + create-react-app.

## Inferno DSL

A Domain Specific Language (DSL) that test writers use to define the tests
in an Inferno Test Kit. The DSL provides built-in functionality that is
useful in testing FHIR APIs, such as a FHIR client and built-in assertion
libraries. See [Writing Tests](http://localhost:4000/docs/writing-tests/) for more information.

## Inferno Test Kit

A distributable set of tests and tools built and packaged
using Inferno to help testers evaluate the conformance of a system to
FHIR base specification requirements, relevant FHIR Implementation
Guides, and any additional requirements. Test Kits are primarily composed of one
or more Test Suites, but may include other tools such as FHIR resource validators
or reference implementations.

## Inferno Template

A template for writing Inferno Test Kits. See [Template Layout](http://localhost:4000/docs/getting-started/repo-layout-and-organization) for more information.

## Inferno Test Suite

An executable set of tests provided within an Inferno Test Kit that allows
testers to evaluate the conformance of a system. They can import tests from other Test Kits. 
Each Test Suite also defines how to interpret failures at the test level and in aggregate.
For example, Test Suite may define that a conformant system will pass all provided
tests, or that the system may fail some tests. 

## Validators

Validators are tools that validate the correctness of a piece of data against a set of rules
defined within a context. Inferno tests typically fetch data and validate the
response using a validator, for example the FHIR Profile Validator or the FHIR Terminology
Validator. Inferno typically performs these functions by providing common
third party validators (e.g. HL7 FHIR Validator).

## Reference Implementations

An Inferno Test Kit may provide one or more Reference Implementations, which
is a program that implements all requirements from a specification (e.g. FHIR) 
and demonstrates "corect" behavior. They can
be useful to develop tests against or to help interact with third party
solutions. For example, Inferno has a [Reference Server](https://github.com/inferno-framework/inferno-reference-server)
for US Core and the Inferno ONC (g)(10) certification tests.

## Inferno Deployment

A web host running one or more Inferno Test Kits. An example is the 
[https://inferno.healthit.gov](https://inferno.healthit.gov) website.
An individual Test Kit can also be run as an Inferno Deployment on 
users' local machines without any additional
configuration. An Inferno Deployment includes a web interface as well as
a RESTful API to enable third party integration.