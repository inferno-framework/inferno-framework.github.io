---
layout: news
title: FHIR Resource Validation DSL Updates
date: 2026-03-09
---

[Version 1.1.0 of Inferno Core](https://github.com/inferno-framework/inferno-core/releases/tag/v1.1.0) enhances the [FHIR resource validation DSL](https://inferno-framework.github.io/docs/writing-tests/fhir-validation.html#validating-fhir-resources) to apply message filters to errors in contained resources and allow test writers to access the complete validation response from the HL7 FHIR Validator.

<!-- break -->

Additional details on these updates:
- When validated resources include contained resources, Inferno will now apply the defined [message filters](https://inferno-framework.github.io/docs/writing-tests/fhir-validation.html#filtering-validation-messages) to profile conformance checks on the contained resources and remove profile conformance errors when all errors related to the target profile have been filtered.
- The `resource_is_valid?` DSL method now includes an option to expose the details of the response from the HL7 FHIR Validator to the Inferno test logic.
 
As a part of this update, the internal implementation of Inferno’s interaction with the HL7 FHIR Validator was updated and refactored. All updates to public methods are backwards compatible. However, the Inferno team is aware that some published Inferno test kits previously used private methods to implement features that are now part of the DSL, specifically running profile validation without displaying the detailed messages to testers. All of the published Inferno test kits that used the internal methods have been updated to use the DSL methods and any community test kits that follow this published pattern must make the same update before using Inferno Core version 1.1.0. See [this pull request](https://github.com/inferno-framework/davinci-plan-net-test-kit/pull/27) for an example of the incorrect pattern that was published and the update needed to achieve the same effect using the DSL.