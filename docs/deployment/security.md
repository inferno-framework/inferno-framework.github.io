---
title: Security Considerations
nav_order: 1
parent: Deployment
layout: docs
---
# Security Considerations
## Server-Side Request Forgery (SSRF)
Inferno is designed to make requests against user-submitted urls, which makes it
important to mitigate against
[SSRF.](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html)
It is not practical to implement SSRF protection within Inferno itself because
which urls are valid and invalid vary based on the particular deployment.
Because of this, it is recommended that deployments use [network-layer SSRF
mitigations.](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html#network-layer)
For example, the Inferno team protects against SSRF in public deployments by
implementing firewall rules in the host operating system which deny Inferno
access to the internal network.
