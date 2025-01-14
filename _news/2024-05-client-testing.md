---
layout: news
title: "Client Testing on Inferno"
section: news
date: 2024-05-14
---

We are introducing suite endpoints to our DSL to enable FHIR client testing on Inferno.

<!-- break -->

## Client Testing on Inferno

The Inferno Framework is primarily a FHIR client simulator for testing of FHIR Servers.
However some FHIR workflows, such as SMART app launch, require Inferno to
[receive requests](https://inferno-framework.github.io/docs/advanced-test-features/waiting-for-requests.html)
and play the server. The community has also been asking for FHIR Client testing to Inferno.
Little by little, we've been adding "server simulator" components to Inferno:


| DSL | Usage |
|:---:|:------|
| `route` | Handle a request with any [Rack-based application](https://github.com/rack/rack). |
| `wait`  | Pause the test run from a test in order to wait for a client request. |
| `resume_test_route` | Handle a request and unpause the Inferno test run. |
| `recieves_request` | Link a recieved request with a test. |
| `suite_endpoint` | Handle a request with a `SuiteEndpoint`. |

While `resume_test_route` could handle
[simple cases](https://inferno-framework.github.io/inferno-core/docs/Inferno/DSL/Runnable.html#resume_test_route-instance_method),
the new `SuiteEndpoint` class and `suite_endpoint` DSL method allow Test Kits to handle
HTTP requests with greater complexity. An
[example](https://inferno-framework.github.io/inferno-core/docs/Inferno/DSL/Runnable.html#suite_endpoint-instance_method)
is available in our documentation.


## Next Steps

We'll keep improving the Inferno Core, the Inferno Framework site, and the FHIR Community
as a whole with future releases. As always, we welcome your feedback and ideas for improvement.
Thank you for your continued support!
