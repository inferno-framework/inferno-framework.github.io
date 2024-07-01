---
title: Advanced Features
nav_order: 14
has_children: true
layout: docs
section: docs
---
# Advanced Features

Now that you've gone through the basics of how to write tests, we can move on to the more advanced features of Inferno.
These pages do not have to be read in order. Feel free to jump around to whatever pages are useful for your 
specific use case:

#### [Input Presets](/docs/advanced-test-features/input-presets.html)
Input presets are sets of predefined input values for a suite. Users can select
a preset to use predefined values without having to manually enter them.

#### [Altering Test Behavior](/docs/advanced-test-features/test-configuration.html)
This page walks through two options of how
to alter test behavior at either boot time or at session creation time, to address use
cases including test reuse, supporting different IG versions, etc.

#### [Serving HTTP Requests](/docs/advanced-test-features/serving-http-requests.html)
Some testing scenarios require that Inferno responds to incoming HTTP requests. 
For example, authorization workflows based on asymmetric client credentials 
require that public keys are served at an accessible location, so Inferno needs to be able to
serve these keys in order to support these workflows.
For these cases, a suite can define custom routes to be served by Inferno, and this page
walks through how to do this.

#### [Waiting for Incoming Requests](/docs/advanced-test-features/waiting-for-requests.html)
Some testing workflows required testing to pause until an incoming request is received.
For example, the OAuth2 workflow used by the SMART App Launch IG involves redirecting the 
user to an authorization server, which then redirects the user back to the application 
that requested authorization. In order to handle a workflow like this, Inferno must be 
able to handle the incoming request and associate it with a particular testing session, and 
this page walks through how to do this.

#### [Scratch](/docs/advanced-test-features/scratch.html)
Scratch provides an alternative to inputs and outputs for passing information between tests.
The benefits of using scratch, and how to use it, can be found on this page.

#### [Configuration Checks](/docs/advanced-test-features/configuration-checks.html)
This page shows how to write a set of checks for Test Suites on startup, to ensure that
their environment is correctly configured.