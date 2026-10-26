---
title: Testing Paradigms
nav_order: 5
parent: Getting Started
section: docs
layout: docs
---
{:toc-skip: .h4 data-toc-skip=""}

# Testing Paradigms

In any direct information exchange, there are two parties:
- One system that initiates, sending a request and then reacting to its response.
- Another system that receives, reacting to that request and responding back.

Inferno's approach to testing differs depending on the role the tested
system plays in the exchange. In a traditional client-server architecture, client
systems initiate most exchanges. So, within Inferno:
- Tests that evaluate systems that initiate requests are referred to
as **client** tests, and
- Tests that evaluate systems that respond to requests are referred to
as **server** tests.

Real systems play both roles, sometimes initiating exchanges and sometimes responding.
Even in FHIR specifications, some actors are required to act in both modes.
Thus, when used in the names of actors or test suites, the terms "client" and "server"
may not always fully indicate which paradigm the Inferno suite is using. Often,
both paradigms will be used within a single suite.

Familiarity with these Inferno testing paradigms helps testers know what to expect
when using Inferno tests. For developers, these paradigms come with foundational design patterns
used in Inferno test kits and are useful when seeking to understand the implementation of existing
test kits or develop new ones.

## Server (Responder) Testing

When testing a server system responsible for responding to requests, Inferno initiates
the requests involved in the testing. Thus, Inferno is in control of the testing exchanges:
it makes all of the requests itself and can show testers the requests it made and
the responses it received, making it clear what Inferno did and what issues arose.
In this paradigm, Inferno defines inputs that allow testers to tell Inferno how to reach
the server and guide the requests that Inferno will make to verify server behavior.

### Key server (responder) paradigm details

- **Role of the tested system**: Responder
- **Role of Inferno**: Initiator
- **What the test inputs provide**: Inputs from the tester tell
  Inferno how to reach the server, e.g., URL and auth details. Inputs also often guide
  Inferno in the requests that it makes. These guiding inputs can be as simple as Patient IDs
  or as complex as complete request bodies.
- **Request timing**: Inferno makes requests when an executed test directs it to.
- **Request content**: Inferno may construct requests based on inputs
  and data retrieved from the server system, or it may rely solely on inputs provided by the tester.
- **Response content**: The server system determines the response based on the request and the
  configuration, data, and logic within that system. Testers provide details in test inputs
  that guide Inferno's requests such that they will elicit responses that demonstrate the
  behavior required by the tests.
- **Tester involvement**: Testers mostly provide inputs and then let Inferno make requests
  and analyze the responses.
- **Debugging connectivity issues**: All of the information about the requests that Inferno made
  is available in the Inferno UI. It can be used in conjunction with logs available on the server
  system to determine the root cause of the problem.

### Example server (responder) paradigm test suites

This is the original style of testing developed for Inferno and is exemplified by the
[server suites in the US Core Test Kit](https://inferno.healthit.gov/test-kits/us-core/)
and the [ONC Certification (g)(10) Test Kit](https://inferno.healthit.gov/test-kits/onc-certification-g10/).
However, note that those tests do not represent pure server (responder) testing:
the OAuth authorization flow used by SMART on FHIR App Launch involves a browser
redirect initiated by the server.

## Client (Initiator) Testing

When testing client systems responsible for initiating requests, Inferno responds to the
testing requests. In this paradigm, the tested system is in control of the requests,
which generally makes the testing process more complex and involved for the tester.
Inferno will define [suite endpoints](/docs/advanced-test-features/waiting-for-requests#advanced-incoming-request-handling)
that specify which requests Inferno will respond to and the responses it provides.
Because Inferno allows multiple test sessions to run simultaneously, Inferno must be able
to determine from the request which active session the request belongs to. Within Inferno,
an "active" session is one that is explicitly waiting for a request. When testers run
tests that involve an exchange initiated by the tested client system (often tagged with the
["Tester-Initiated Exchange" badge](/docs/writing-tests/properties#tester-initiated-exchange)),
Inferno will display a ["User Action Required" dialog](/docs/advanced-test-features/waiting-for-requests#wait-modal)
that indicates the session is actively waiting for requests. This dialog, will document
what Inferno is waiting for, how it will recognize incoming requests, and how it will
respond. When a request to Inferno is associated with the waiting session, Inferno will
respond, creating a response using inputs provided by the tester and, in some cases, prior
requests. Inferno can only see and display the requests it received that were actually
associated with the session, so diagnosis of connectivity issues often relies solely on
client system logs.

### Key client (initiator) paradigm details

- **Role of the tested system**: Initiator
- **Role of Inferno**: Responder
- **What the test inputs provide**: Inputs from the tester tell Inferno how to recognize requests
  from the client, e.g., through specific auth details, and provide information that drives
  the content that Inferno will put in its responses.
- **Request timing**: The client system makes requests but can only do so when the Inferno session
  is explicitly waiting for them, signaled via an active "User Action Required" dialog. If the
  Inferno session is not waiting and listening for the requests, an error response will always be returned.
- **Request content**: The client system builds requests based on the actions taken by the tester and the
  configuration, data, and logic within that system.
- **Response content**: Inferno determines the responses based on the logic defined in the
  [suite endpoint](/docs/advanced-test-features/waiting-for-requests#advanced-incoming-request-handling)
  associated with the target URL. To determine the response content, that logic can use the
  request and the context provided by the associated session, including which test is
  actively waiting, the inputs to that test, and potentially previous requests made during
  the session. Testers provide inputs to Inferno to guide Inferno's responses such that
  they will elicit reactions by the client that demonstrate the behavior required by the
  tests.
- **Tester involvement**: Testers must take actions within the client system that trigger the
  initiation of one or more exchanges with Inferno. Because the client system may need
  to react to Inferno's response in a certain way that is not fully visible to Inferno
  (e.g., the display of a detail from the response), testers often need to observe the
  client system once a response has been received and confirm the required behavior
  that Inferno cannot observe.
- **Debugging connectivity issues**: The Inferno testing session can only display messages that
  it actually received and recognized. Testers will need to rely on logs available on the
  client system, which may include Inferno responses, and compare the details to what
  Inferno expected as documented in the "User Action Required" dialog. See the
  [Debugging Inferno responses](#debugging-inferno-responses) section below for help
  in diagnosing issues.

### Example client (initiator) paradigm test suites

The client (initiator) style of testing is exemplified by the client suites of the
Da Vinci burden reduction test kits that support electronic prior authorization, including
the client suites in the [CRD](https://inferno.healthit.gov/test-kits/davinci-crd/),
[DTR](https://inferno.healthit.gov/test-kits/davinci-dtr/), and
[PAS](https://inferno.healthit.gov/test-kits/davinci-pas/)
test kits.

### Debugging Inferno responses during client (initiator) testing

#### Debugging connectivity issues

Until a request from the client system reaches Inferno and gets associated
with an active session, it will not be visible within the Inferno UI.
When the client system receives an error response to a request sent
to Inferno or it is otherwise unclear whether the request reached Inferno,
compare the response to the following cases for help in determining
what might be happening:
- Response indicating that "Inferno could not find an
  active test run": Inferno received the request, but failed to
  associate it with the session. This may be sent as a FHIR OperationOutcome
  or as plain text depending on the [Inferno endpoint definition](/docs/advanced-test-features/waiting-for-requests#advanced-incoming-request-handling).
  In either case, the details of the error message can help
  determine what went wrong:
  - Error message shows an unexpected target URL: The error message will contain the
    URL at which Inferno received the request, including the host
    and suite. If those details do not look right, the client system's
    configuration may need to be updated to point to the correct
    target Inferno host and suite.
  - "no identifier found": Indicates that the request did not contain
    a link to the target session in the location that the [Inferno endpoint definition](/docs/advanced-test-features/waiting-for-requests#advanced-incoming-request-handling)
    looked for it. The error message may include details on where Inferno looked for
    the identifier. Alternatively, that information will be in the
    "User Action Required" dialog or elsewhere in the test suite documentation.
    If possible, update the request to include the identifier at the
    expected location so that Inferno can recognize which session to
    link the request to. If that is not possible, the test suite may
    include other ways that Inferno can find the session associated
    with a request.
  - "identifier 'X' ... is not associated with a waiting session":
    Inferno found an identifier to use to link to a waiting session,
    but did not find a session with that identifier. This could mean
    that the session was not waiting with an active "User Action Required"
    dialog, or that the "User Action Required" dialog had expired.
    If the session appears to be actively waiting, first check that the
    identifier found matches what Inferno is expecting based on documentation
    in the "User Action Required" dialog. Next, check that the request is
    going to the expected Inferno host.
  - "error encountered while determining the test run identifier":
    The request is malformed in some way that Inferno does not
    handle well. Check the request and consider submitting a GitHub
    issue in the test kit's repository providing the specific request,
    the URL it was sent to, and the response.
- Another response: This could be an Inferno response to a request that was
  correctly associated with a session. If unsure, confirm by using the technique
  described in the [Debugging other unexpected responses](#debugging-other-unexpected-responses)
  section to see if the request got associated with the waiting test.
  If the request does not show up there, it did not reach Inferno.
  Check the client configuration to ensure requests are going to the
  right URL.

#### Debugging other unexpected responses

Typically, Inferno's simulated endpoints are designed to be permissive
and return successful responses whenever possible, even if the requests
or the responses are not themselves conformant and won't pass the tests.
However, if confirmation is needed that a response came from Inferno,
all requests that the Inferno session received and responded to while
waiting at a "User Action Required" dialog can be seen in the Inferno UI.

To see the requests received by Inferno and associated with the session
while a "User Action Required" dialog was active, select the test and
view the Requests tab. To do so, if the run is not already finished,
first either cancel the test run or continue and complete it using the
instructions, links, or buttons in the "User Action Required"
dialog. When searching for the test to select, look for the test with
the [teal "Tester-Initiated Exchange" badge](/docs/writing-tests/properties#tester-initiated-exchange)
within the executed group. If the suite uses the badge, containing groups
will have it, too, providing a path to the right test. Once the test is
selected, all requests that Inferno received and associated with the session
while its "User Action Required" dialog was active will be listed on the
test's Requests tab with details of the request received and Inferno's
response. If the test run was completed instead of canceled, other tests
may have requests associated with them, but they won't necessarily
represent all the requests that Inferno received.

## Multi-paradigm Testing

Because real exchanges require "clients" to respond to some requests and "servers" to
sometimes initiate requests, Inferno test suites often contain both paradigms, sometimes
in complex ways. For example:

- The [CRD IG](https://hl7.org/fhir/us/davinci-crd/2.2.1/en/) requires "clients" to initiate
  CDS hook requests and also expose FHIR server endpoints. [Inferno's CRD client tests](https://inferno.healthit.gov/test-kits/davinci-crd/)
  both
  - Contain sections that separately test a CRD client's ability to initiate requests and
    its ability to respond to FHIR interactions.
  - Initiate requests to the CRD client during hook requests that the CRD client initiated,
    interleaving server testing within the client testing paradigm.
- [FHIR Subscriptions](https://hl7.org/fhir/uv/subscriptions-backport/STU1.1/) require "servers"
  to receive requests for a new Subscription and then initiate a notification based on that
  Subscription. [Inferno's tests](https://inferno.healthit.gov/test-kits/subscriptions/)
  must switch between paradigms within a single test run:
  - The Inferno Subscriptions server suite initiates a Subscription request and then waits for
    notifications.
  - The Inferno Subscriptions client suite waits for a Subscription request and then initiates
    notifications.

In general, multi-paradigm tests will involve the higher level of complexity and tester
interaction of the client (initiator) testing paradigm.

