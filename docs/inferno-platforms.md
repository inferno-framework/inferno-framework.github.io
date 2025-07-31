---
title: Inferno Platforms
nav_order: 27
layout: docs
section: docs
---

# Bundle Test Kits with Inferno Platforms

Inferno Test Kits double as both Ruby gems and applications.
[Inferno Platforms](https://github.com/inferno-framework/inferno-platform-template/)
can load multiple Test Kits as Ruby gems together, offering a unified interface
for hosting a set of Test Kit on shared infrastructure. This offers a more feature-rich
experience than deploying an individual Test Kit, or importing multiple Test Suites
into one Test Kit.

Note the Inferno Platform is still in early release and should be considered unstable.

{% include figure.html 
    file="inferno-platform.png"
    alt="Landing Page of Inferno Platform"
    caption="Inferno Platform bundles Test Kits into a unified interface."
    description="Inferno Platform Template allows you to describe the purpose of the platform, showcases Test Kits, and preview upcoming news and events all on the landing page."
    maxwidth="466px"
%}

{% include figure.html 
    file="inferno-platform-test-kits.png"
    alt="Inferno Platform Test Kits page"
    caption="Inferno Platform listing multiple Test Kits."
    description="Inferno Platform listing the US Core, SMART App Launch, and International Patient Summary Test Kits, with a search bar and filters."
    maxwidth="466px"
%}

The primary features of Inferno Platform are:
 - News and other non-Test-Kit pages
 - Searching and filtering Test Kits
 - Data retention and clearing policies

You can visit [inferno.healthit.gov](https://inferno.healthit.gov) for a production example of an Inferno Platform.

See the [Inferno Platform Template](https://github.com/inferno-framework/inferno-platform-template/) repository
for instructions on getting started, adding Test Kits, and other features.

