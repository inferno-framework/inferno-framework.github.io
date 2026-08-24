---
title: FHIR Validation
nav_order: 6
parent: Writing Tests
layout: docs
section: docs
---
# FHIR Resource Validation
[FHIR Resource validation](https://www.hl7.org/fhir/validation.html) is
performed by the [HL7® FHIR Java Validator](https://github.com/hapifhir/org.hl7.fhir.core).
accessed via the [HL7 Validator Wrapper](https://github.com/hapifhir/org.hl7.fhir.validator-wrapper).

When creating a Test Kit based on the [Inferno
Template](https://github.com/inferno-framework/inferno-template), IG packages do
not need to be included if the IG is available from the FHIR package server. If
you need to validate against an unpublished IG, place the `.tgz` IG packages in
`lib/YOUR_TEST_KIT_NAME/igs`. At runtime, all IG packages in
`lib/YOUR_TEST_KIT_NAME/igs` as well as those in corresponding locations in
other loaded test kits, are copied to `data/igs`, and the validator accesses the
IG files from that location. Do not manually edit the contents of `data/igs`, as
the contents are automatically deleted prior to loading.

## Defining Validators
The Inferno Template defines one basic validator in the suite. The validator must be configured to
reference the IG being tested against. IGs may be referenced by package identifier
(for example, `'hl7.fhir.us.core#1.0.0'`) if they are published, or by filename.
It is not necessary to alter the template suite further unless you need multiple validators or want to add
[extra validator behaviors](/docs/writing-tests/fhir-validation.html#performing-additional-validation). Validators are defined with `fhir_resource_validator`:

```ruby
fhir_resource_validator :optional_validator_name do
  # Read the validator URL from an environment variable (optional)
  url ENV.fetch('FHIR_RESOURCE_VALIDATOR_URL')

  # Specify the IG(s) to validate resources against
  igs 'identifier#version' # Use this method for published IGs/versions
  igs 'igs/filename.tgz'   # Use this otherwise
  igs 'ig1#v', 'ig2#v'     # Specify all IGs in one line if multiple are needed
end
```

The `url` defaults to reading from the `FHIR_RESOURCE_VALIDATOR_URL` environment variable, so if you
have not modified the validator service or environment variables, this line may be omitted.

If no `igs` are specified, the validator will only support validation against base FHIR definitions,
and attempting to validate against specific profile URLs will result in errors.

[`fhir_resource_validator` in the API
docs](/inferno-core/docs/Inferno/DSL/FHIRResourceValidation/ClassMethods.html#fhir_resource_validator-instance_method)

### Controlling Validator Behavior

The HL7® FHIR Java Validator used by Inferno includes many
[options and flags that control its behavior](https://confluence.hl7.org/spaces/FHIR/pages/35718580/Using+the+FHIR+Validator).
Some of these can be specified within the HL7 validator-wrapper's API. To tell Inferno
which flags and values to pass when validating resources, specify them as properties within a
`validation_context` block in the validator definition. For example, the following
definition tells the validator to flag all unknown extensions as errors:

```ruby
fhir_resource_validator :no_custom_extensions do
  validation_context do
    extensions [] # no extensions not in the spec
  end
end
```

By default, Inferno provides the following key-value pairs in the context when invoking the
validator. Providing specific values within a validator definition will override them:

- `"sv": "4.0.1'"`: targets the 4.0.1 version of FHIR
- `"doNative": false`: disables validation of xml, json, and RDF content against relevant non-FHIR schemas.
- `"extensions": ["any"]`: custom (unknown) extensions are allowed
- `"disableDefaultResourceFetcher": true`: Limits the validator to use IG definitions loaded explicitly
    by Inferno and declared dependencies.

Note that at this time, validator behavior flags are associated with validator definitions
only and cannot be specified as a part of Inferno assertions and dsl methods described
below that trigger validation. If different validation context parameters need to be sent,
define additional validator instances to use for them and specify the correct validator
instance when performing the validation.

### Controlling Terminology Validation Behavior

When making `$validate-code` calls against the terminology server, the FHIR validator
can pass along additional `parameter` entries. This can be used, for example to force
the use of more recent code system versions that correspond to those actually loaded on
the target terminology server.

Inferno validator definitions can specify the additional `parameter` entries to provide
as a json Parameters resource either within a particular validator definition or
for all validator defintions using an environment variable.

To specify the additional `parameter` entries to use for a particular validator instance
provide an `expansion_parameters` value within the validator definition. The value can
either be a hash representation of a Parameters resource, or it can be a string referencing
a file available within the gem that contains a json Parameters resource. For example,
the following definition provides the Parameters directly as a hash and forces the use
of particular versions of the RxNorm and SNOMED code systems:

```ruby
fhir_resource_validator :fixed_code_system_versions do
  validation_context do
    expansion_parameters {
      "resourceType":"Parameters",
      "parameter": [
        {
          "name":"force-system-version",
          "valueCanonical":"http://www.nlm.nih.gov/research/umls/rxnorm|03022026"
        },
        {
          "name":"force-system-version",
          "valueCanonical":"http://snomed.info/sct|http://snomed.info/sct/731000124108/version/20250901"
        }
      ]
    }
  end
end
```

Additional `parameters` entries can also be defined at the [deployment](https://inferno-framework.github.io/docs/deployment/) /
[platform](https://inferno-framework.github.io/docs/inferno-platforms.html) level
using the `FHIR_RESOURCE_VALIDATOR_EXPANSION_PARAMETERS` environment variable.
If specified, all validator instances that do not specify their own `expansion_parameters`
value will use the Parameters resource specified there when communicating with the validator.
Like the `expansion_parameters` validator definition property, the value of the 
environment variable can either be a raw json string or a filepath referencing a file
available within the deployment that contains a json Parameters resource.

NOTE: there is currently a bug in the HL7 validator that causes `parameter` entries
with the same name as previous entries to be dropped. The HL7 validator team is
working on a fix.

## Validating FHIR Resources
The `resource_is_valid?` method will validate a FHIR resource and add any
validation messages to the runnable. You can add a prefix to all messages
logged by setting `message_prefix: 'Prefix - '`.

You can optionally skip adding validation messages by setting `add_messages_to_runnable: false`.

The `validator_response_details` parameter allows you to capture the detailed validator output
for custom processing. Pass an empty array, and it will be populated with all validation issues.
See [Accessing Detailed Validation Results](#accessing-detailed-validation-results) for more information.

```ruby
test do
  fhir_read(:patient, '123')

  # Validate the resource from the last request
  if resource_is_valid?
  end

  # Validate the resource from last request without adding messages to the runnable
  if resource_is_valid?(add_messages_to_runnable: false)
  end

  # Validate some other resource
  if resource_is_valid?(resource: some_other_resource)
  end

  # Validate against a particular profile
  if resource_is_valid?(profile_url: 'http://example.com/fhir_profile_url')
  end

  # Validate using a particular named validator
  if resource_is_valid?(validator: :my_customized_validator)
  end

  # Capture detailed validation results for custom processing
  validation_details = []
  unless resource_is_valid?(validator_response_details: validation_details, add_messages_to_runnable: false)
    # Resource is invalid, analyze the detailed error information
    validation_details.select { |issue| issue.severity == 'error' }.each do |issue|
      add_message('error', issue.message) if issue_of_interest?(issue)
    end
  end
end
```

[`resource_is_valid?` in the API
docs](/inferno-core/docs/Inferno/DSL/FHIRValidation.html#resource_is_valid%3F-instance_method)

`assert_valid_resource` will validate the resource, add any validation messages
to the runnable, and fail the test if the resource is invalid.

```ruby
test do
  fhir_read(:patient, '123')

  # Use the resource from the last request
  assert_valid_resource

  # Validate some other resource
  assert_valid_resource(resource: some_other_resource)

  # Validate against a particular profile
  assert_valid_resource(profile_url: 'http://example.com/fhir_profile_url')

  # Validate using a particular named validator
  assert_valid_resource(validator: :my_customized_validator)
end
```

[`assert_valid_resource` in the API
docs](/inferno-core/docs/Inferno/DSL/Assertions.html#assert_valid_resource-instance_method)

## Filtering Validation Messages
If you need to ignore certain validation messages in your test kit, this can be
done using the `exclude_message` method in the validator definition.

```ruby
fhir_resource_validator do
  # Messages will be excluded if the block evaluates to a truthy value
  exclude_message do |message|
    message.type == 'info' ||
      message.message.include?('message to ignore') ||
      message.message.match?(/regex_filter/)
  end
end
```

## Performing Additional Validation

### Custom Validation Logic
If you want to perform validation steps in addition to the FHIR validation,
you can use the `perform_additional_validation` method in the validator definition. The method
can also be used multiple times in a single validator definition to add multiple
validation steps. To add additional validation messages, the block in
this method must return a single Hash with a `type` and `message`, or an Array
of Hashes with those keys. If the block returns `nil`, no new messages are
added. The resource is considered invalid if any messages with a `type` of
`error` are present.

```ruby
fhir_resource_validator do
  perform_additional_validation do |resource, profile_url|
    if something_is_wrong
      { type: 'error', message: 'something is wrong'}
    end
  end
end
```

### Accessing Detailed Validation Results
The `validator_response_details` parameter provides access to the complete validation output
from the validator service, including both filtered and unfiltered issues. This is useful when
you need to perform custom analysis, present validation results differently, or implement
conditional logic based on specific validation patterns.

When you pass an empty array to `validator_response_details`, it will be populated with validator
issue objects that contain the full formatted response from the validator service. Each issue
includes a `filtered` flag that indicates whether the issue would have been excluded by default
filtering rules (such as those defined by `exclude_message`).

#### Validator Issue Structure
Each validator issue object in the `validator_response_details` array contains:

- **`message`** (String): The formatted validation message, including location information
- **`severity`** (String): The severity level - `'error'`, `'warning'`, or `'info'`
- **`location`** (String): The location in the resource where the issue was found
- **`filtered`** (Boolean): Whether this issue would be filtered out by default exclusion rules
- **`slice_info`** (Array): Nested validator issues/information (each with the same structure);
  typically provide details of the base-level issue, including any sub-errors or warnings
- **`resource`** (FHIR::Model): The resource being validated
- **`raw_issue`** (Hash): The complete raw issue hash from the validator service

## Validating Objects Against Logical Models

FHIR also supports the definition of logical models that can be used to check the structure of generic objects.
The `conforms_to_logical_model?` method will validate a parsed json object against a specified model
using the same process and with the same options as when [validating FHIR Resources](#fhir-resource-validation).

```ruby
test do
  hook_requests = load_tagged_requests('encounter-start-requests')
  hook_request_object = parsed_json_if_valid(hook_requests.first.request_body, continue: false)
  if conforms_to_logical_model?(hook_request_object,
       'http://hl7.org/fhir/tools/StructureDefinition/CDSHooksRequest')
    # Perform additional checks if the parsed request body conforms to the CDSHooksRequest Logical Model
  end
end
```

[`conforms_to_logical_model?` in the API
docs](/inferno-core/docs/Inferno/DSL/FHIRValidation.html#conforms_to_logical_model%3F-instance_method)

`assert_conformance_to_logical_model` will validate the resource, add any validation messages
to the runnable, and fail the test if the object is not conformant.

```ruby
test do
  hook_requests = load_tagged_requests('encounter-start-requests')
  hook_request_object = parsed_json_if_valid(hook_requests.first.request_body, continue: false)
  assert_conformance_to_logical_model(
    hook_request_object,
    'http://hl7.org/fhir/tools/StructureDefinition/CDSHooksRequest'
  )
  end
end
```

[`assert_conformance_to_logical_model` in the API
docs](/inferno-core/docs/Inferno/DSL/Assertions.html#assert_conformance_to_logical_model-instance_method)

# Checking for Must Support Element Presence

Checking the presence of Must Support elements across a collection of resources is a common
validation step performed in many test kits. Inferno provides a standard assertion that takes a
list of resources and either a profile url or a pre-computed representation of the profile metadata that
includes details on its must support elements:

```
assert_must_support_elements_present(resources, profile_url)
assert_must_support_elements_present(resources, nil, metadata: pre_extracted_metadata)
```

If provided, the `metadata` input should be an instance of the [ProfileMetadata class](/inferno-core/docs/Inferno/DSL/ProfileMetadata.html).
If not provided, the metadata will be extracted for the indicated profile url on the fly using
the [MustSupportMetadataExtractor class](/inferno-core/docs/Inferno/DSL/MustSupportMetadataExtractor.html).

[`assert_must_support_elements_present` in the API docs](/inferno-core/docs/Inferno/DSL/Assertions.html#assert_must_support_elements_present-instance_method)