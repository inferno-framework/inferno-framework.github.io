---
title: Test Assertions and Results
nav_order: 5
parent: Writing Tests
layout: docs
section: docs
---
{:toc-skip: .h4 data-toc-skip=""}

# Test Assertions and Results
## Assertions
Assertions are used in Inferno to check the behavior under test. When an
assertion fails, execution of that test ends, and it gets a failing result. The
most basic form of an assertion is the `assert` method, which takes two
arguments:
- The first argument determines whether the assertion passes or fails. It will
  pass if the value is truthy (anything other than `false` or `nil`), and fail
  if the value is falsey (`false` or `nil`).
- The second value is the message which will be displayed if the assertion
  fails. Messages provided to assertions support [Markdown](https://commonmark.org/help/)
  syntax.
 
```ruby
test do
  run do
    assert 1 > 0, 'This assertion will never fail'
    assert 1 < 0, '1 is not less than 0'
  end
end
```
Inferno also implements more specific assertions to handle common cases, such as:
- Verifying the HTTP status code of a response.
- Verifying that a string is valid JSON.
- Validating a FHIR Resource.
- Checking conformance to a FHIR Logical Model.

Check out the [assertions API
documentation](/inferno-core/docs/Inferno/DSL/Assertions.html) for detailed
information on all available assertions.

### Assertion Examples
{:toc-skip}

```ruby
test do
  first_request = fhir_read(:patient, '123')
  second_request = fhir_read(:patient, '456')

  # These assertions are all made against the second request, since it was the
  # request most recently defined
  assert_response_status(200)
  assert_response_content_type('application/fhir+json')
  assert_valid_json(request.response_body)
  assert_resource_type(:patient)
  assert_valid_resource

  # The remaining assertions are all made against the first request, which
  # requires defining variables explicitly
  assert_response_status(200, request: first_request)
  assert_response_content_type('application/fhir+json', request: first_request)
  assert_valid_json(first_request.response_body)
  assert_resource_type(:patient, resource: first_request.resource)
  assert_valid_resource(resource: first_request.resource)

  # Validate against a specific profile, using "resource" defined in the
  # previous assertion
  assert_valid_resource(profile_url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient')

  # Run a FHIR search
  fhir_search(:medication_request, params: { patient: '123', _include: 'MedicationRequest:medication'_ })

  # Bundle entry validation
  # Validate all entries from the most recent (FHIR search) request
  assert_valid_bundle_entries
  # Only validate MedicationRequest Bundle entries
  assert_valid_bundle_entries(resource_types: 'MedicationRequest')
  # Only validate MedicationRequest and Medication Bundle entries
  assert_valid_bundle_entries(resource_types: ['MedicationRequest', 'Medication'])
  # Only validate MedicationRequest and Medication Bundle entries. Validate
  # MedicationRequest resources against the given profile, and Medication
  # resources against the base FHIR Medication resource.
  assert_valid_bundle_entries(
    resource_types: {
      'MedicationRequest': 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest',
      'Medication': nil
    }
  )

  # Logical model validation checks parsed json represented as a Ruby Hash
  hook_request_object = {
    hook: 'encounter-start',
    hookInstance: '753593b6-8fa1-45e3-a108-978256af0f5c',
    context: {
      userId: 'Practitioner/example',
      patientId: 'example'
    }
  }
  assert_conformance_to_logical_model(
    hook_request_object,
    'http://hl7.org/fhir/tools/StructureDefinition/CDSHooksRequest'
  )

  # Check and using parsed json without immediately ending the test
  requests.each do |hook_request| # previously made or loaded hook requests
    parsed_hook_request = parsed_json_if_valid(hook_request.request_body)
    next unless parsed_hook_request.present?
  
    # hook request validation logic
  end
  assert_no_error_messages
end
```

## Results
Tests can have the following results in Inferno:
- `pass` - Inferno was able to verify correct behavior.
- `fail` - Inferno was able to verify incorrect behavior.
- `skip` - Inferno was unable to verify correct or incorrect behavior. For
  instance, a test may need to validate a Condition resource, but none are
  available on the server. Inferno was not able to validate the resource, but
  the server is also not demonstrating incorrect behavior. A `skip` prevents a
  test session from passing because some behavior could not be verified.
- `omit` - Inferno does not need to verify behavior. For example, an
  Implementation Guide may say that if a server does not do A, then it must do
  B. Inferno has verified that the server does A, so it does not make sense to
  verify B. An `omit` does not prevent a test session from passing because it
  indicates behavior that does not need to be verified.
- `error` - Something unexpected happened and caused an internal server error.
  This indicates a problem in a Test Kit or in Inferno itself. If you determine this error
  is not expected behavior for the given test and inputs, you should
  contact the Test Kit author or the Inferno team.
- `wait` - A test is waiting to receive an incoming request, and will resume
  once it is received (see [Waiting for an Incoming
  Request](/docs/advanced-test-features/waiting-for-requests.html)).
- `cancel` - Test cancelled by user.

### Assigning specific results
{:toc-skip}

Inferno provides methods to assign some specific results to a test:
- `pass/pass_if` - These can be used to end test execution early.
- `skip/skip_if`
- `omit/omit_if`

The `*_if` methods take the same kind of arguments as `assert`, a value whose
truthiness will be evaluated, and a message to be displayed. The other methods
just take a message. For more information, view the [results API
documentation](/inferno-core/docs/Inferno/DSL/Results.html).

```ruby
test do
  run do
    omit_if test_should_be_omitted, 'This test is being omitted because...'
    skip_if test_should_be_skipped, 'This test is being skipped because...'
    pass_if test_should_pass
    
    skip 'This test is being skipped'
  end
end
```

`skip/omit` can also take a block instead of a message. If an assertion fails
inside of that block, then the test will skip/omit instead.

```ruby
test do
  run do
    skip do
      assert false, 'This test will skip rather than fail'
    end
  end
end
```

### Info and Warning messages
{:toc-skip}

Test results can have error, warning, and info messages associated with them.
Error messages are typically generated by failing assertions. You can use the
`warning` and `info` messages to add those message types to a result, or to turn
a failed assertion message into a warning or info message. Info and warning
messages are dispayed in the UI, but do not affect the test result.

```ruby
test do
  run do
    info 'This info message will be added to the result'
    info do
      assert false, %(
        This assert is inside an `info` block, so it will not halt test execution
        if it fails, and this will be an info message rather than an error
        message.
      )
    end
    
    warning 'This warning message will be added to the result'
    warning do
      assert false, %(
        This assert is inside a `warning` block, so it will not halt test
        execution if it fails, and this will be a warning message rather than an
        error message.
      )
    end
  end
end
```
[`info` in the API
docs](/inferno-core/docs/Inferno/DSL/Messages.html#info-instance_method)

[`warning` in the API
docs](/inferno-core/docs/Inferno/DSL/Messages.html#warning-instance_method)

### Adding Messages Directly to Results

Error, Warning, and Info messages can also be added to the results of a test using
the `add_message` method:

```
add_message(:error, 'This is an error.)
add_message(:warning, 'This is a warning.)
add_message(:info, 'This is informational.)

```

Unlike using assertions, but like the `warning` and `info` DSL methods, `add_message`
does not stop execution of the test. This can be useful because it allows
analysis to complete and multiple error messages to be returned, e.g., across multiple
requests. However, adding a message with type `:error` does not automatically cause the
test to fail. Tests that use this approach to log error messages directly to the result
can use either of the following two methods at the end of the test logic to trigger a
failure or a skip if error messages were logged:

```
assert_no_error_messages # If error messages present, fails with a standard result message
assert_no_error_messages('Errors detected.') # If error messages present, fails with a custom result message
skip_if error_messages? # If error messages present, skips with a standard result message
skip_if error_messages?, 'Errors detected.' # If error messages present, skips with a custom result message
```

[`add_message` in the API
docs](/inferno-core/docs/Inferno/DSL/Messages.html#add_message-instance_method)

[`error_messages?` in the API
docs](/inferno-core/docs/Inferno/DSL/Messages.html#error_messages%3F-instance_method)

[`assert_no_error_messages` in the API
docs](/inferno-core/docs/Inferno/DSL/Assertions.html#assert_no_error_messages-instance_method)


## Customizing Suite and Group results

By default, a suite or group will pass when all of its required children pass
(or omit). This behavior can be customized by defining a `run` block in the
suite/group. Within this `run` block, `results` will return a
[`ResultCollection`](/inferno-core/docs/Inferno/DSL/ResultCollection.html) which
can be used to inspect child results and use them to determine what the
suite/group result should be. `ResultCollection` includes the [Ruby `Enumerable`
module](https://docs.ruby-lang.org/en/3.3/Enumerable.html), so the methods in
that module may be called on the `ResultCollection`.

```ruby
group do
  test from: :test_1
  test from: :test_2
  test from: :test_3
  test from: :test_4

  # define custom result logic for this group 
  run do
    # omit if test 1 didn't pass
    omit_if results[0].result != 'pass'
   
    # skip if any tests skipped
    skip_if results.any? { |result| result.result == 'skip' }

    # fail if tests 3 & 4 didn't pass
    assert results[:test_3].result == 'pass' && results[:test_4].result == 'pass',
           'Tests 3 and 4 did not both pass'
           
    # if the run block reaches the end, the suite/group will pass
  end
end
```
