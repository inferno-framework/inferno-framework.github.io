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
Two validator "wrapper" services are currently included in the Inferno framework:
 - [HL7 Validator Wrapper](https://github.com/hapifhir/org.hl7.fhir.validator-wrapper)
   - Used to validate resources as part of the test suite
 - [Inferno Validator Wrapper](https://github.com/inferno-framework/fhir-validator-wrapper) (deprecated)
   - Used to support the Validator UI until the UI is transitioned to use the HL7 service

When creating a Test Kit based on the 
[Inferno Template](https://github.com/inferno-framework/inferno-template):

* Place the `.tgz` IG packages for any profiles you need to validate against in
  `lib/YOUR_TEST_KIT_NAME/igs`.
* Make sure that the volume paths in `docker-compose.background.yml` point to
  the above directory.

Every time an IG is added or changed, restart the validator services.

### Defining Validators
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

## Validating FHIR Resources
The `resource_is_valid?` method will validate a FHIR resource and add any
validation messages to the runnable.

```ruby
test do
  fhir_read(:patient, '123')
  
  # Validate the resource from the last request
  if resource_is_valid?
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
