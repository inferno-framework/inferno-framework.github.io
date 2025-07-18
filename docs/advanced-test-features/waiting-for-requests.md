---
title: Waiting for Incoming Requests
nav_order: 4
parent: Advanced Features
layout: docs
section: docs
---
# Waiting for Incoming Requests
Some testing workflows required testing to pause until an incoming request is
received. For example, the OAuth2 workflow used by the SMART App Launch IG
involves redirecting the user to an authorization server, which then redirects
the user back to the application that requested authorization. In
order to handle a workflow like this, Inferno must be able to handle the
incoming request and associate it with a particular testing session. Inferno
accomplishes this with the `wait` status and special routes for resuming tests.

## Wait Method
A test is instructed to wait for an incoming request using the
[`wait`](/inferno-core/docs/Inferno/DSL/Results.html#wait-instance_method)
method. `wait` takes three arguments:
* `identifier` - An identifier which can uniquely identify the current test
  session. It must be possible for this identifier to be reconstructed based on
  the incoming request.
* `message` - A markdown string displayed to the user while the
  test is waiting.
* `timeout` - The number of seconds the test will wait.

[`wait` in the API
docs](/inferno-core/docs/Inferno/DSL/Results.html#wait-instance_method)

## Simple Incoming Request Handling
The route for making a test resume execution is created with
[`resume_test_route`](/inferno-core/docs/Inferno/DSL/Runnable.html#resume_test_route-instance_method),
which takes the following arguments:
* `method` - A symbol for the HTTP verb for the incoming request (`:get`,
  `:post`, etc.)
* `path` - A string for the route path. The route will be served at
  `INFERNO_BASE/custom/SUITE_ID/CUSTOM_ROUTE_PATH`.
* `tags` - An array of tags to apply to the request. See [Tagged
  Requests](/docs/writing-tests/making-requests.html#tagged-requests).
* `result` - A string (default `"pass"`) representing the result that the wait
  test should receive when the incoming request is received. See
  [Results](/docs/writing-tests/assertions-and-results.html#results) for
  possible values.
* A block that extracts the `identifier` from the incoming request and returns it.
  In this block, `request` can be used to access a [`Request`
  ](/inferno-core/docs/Inferno/Entities/Request.html) object which contains the
  details of the incoming request.
  
If it is necessary to inspect the incoming request in a test, the incoming
request can be assigned a name using `receives_request :my_request_name` (see
[Reusing
Requests](/inferno-core/writing-tests/making-requests.html#reusing-requests)).

[`resume_test_route` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#resume_test_route-instance_method)

[`receives_request` in the API
docs](/inferno-core/docs/Inferno/DSL/RequestStorage/ClassMethods.html#receives_request-instance_method)

### Example
This example will show how to implement the redirect flow in the [SMART App
Launch Standalone Launch
Sequence](http://hl7.org/fhir/smart-app-launch/1.0.0/#standalone-launch-sequence).
The steps are as follows:
* Redirect the user to the system under test's authorize endpoint.
  * The client (Inferno) generates a random `state` value which the
    authorization server sends back, so `state` can be used as the `identifier`.
* Wait for the user to be redirected back to Inferno.
  * Extract `state` from the incoming request to match the current test session.
* Check that the incoming request contained a `code` parameter.

```ruby
class SMARTAppLaunchSuite < Inferno::TestSuite
  id :smart_app_launch
  
  # This route will be served at INFERNO_BASE/custom/smart_app_launch/redirect
  # Since the `state` query parameter is what uniquely links the incoming request
  # to the current test session, return that from the block.
  resume_test_route :get, '/redirect' do |request|
    request.query_parameters['state']
  end
  
  group do
    id :standalone_launch
    
    test do
      id :smart_redirect
      
      # Assign a name to the incoming request so that it can be inspected by
      # other tests.
      receives_request :redirect
      
      run do
        # Generate a random unique state value which uniquely identifies this
        # authorization request.
        state = SecureRandom.uuid
        
        # Build authorization url based on information from discovery, app
        # registration, and state.
        authorization_url = ...
        
        # Make this test wait.
        wait(
          identifier: state,
          message: %(
            [Follow this link to authorize with the SMART server](#{authorization_url}).

            Tests will resume once Inferno receives a request at
            `#{Inferno::Application['base_url']}/custom/smart_app_launch/redirect`
            with a state of `#{state}`.
          )
        )
      end
    end
    
    # Execution will resume with this test once the incoming request is
    # received.
    test do
      id :redirect_contains_code
      
      # Make the incoming request from the previous test available here.
      uses_request :redirect
      
      run do
        code = request.query_parameters['code']
        
        assert code.present?, 'No `code` parameter received'
      end
    end
  end
end
```

## Advanced Incoming Request Handling
The `suite_endpoint` method can be used for more advanced handling of incoming
requests, such as:
- handling multiple incoming requests with customized logic to determine when to
  resume the test, or
- returning particular responses to incoming requests rather than redirecting
  the user the UI.
Like `resume_test_route`, `suite_endpoint`
takes a method (such as `:get` or `:post`), and a path for the final url
fragment in the route. All of the other configuration, however, is handled by an
`Inferno::DSL::SuiteEndpoint` class.

A `SuiteEndpoint` is based on a [Hanami
endpoint](https://github.com/hanami/controller/tree/v2.0.0), so much of the
functionality is the same. In a `SuiteEndpoint`, `request` and `response` return
Hanami request/response objects. There are several methods that should be
overridden in a `SuiteEndpoint`:
- `test_run_identifier` - This method needs to return the identifier value
  specified by `wait` in the waiting test based on information in the incoming
  request
- `make_response` - This method constructs the response.
- `tags` - This method defines which tags should be apllied to the request.
- `name` - This method defines a name for the request.
- `update_result` - This method updates the test result. The tests will resume
  once the result has been updated to have a result other than `waiting`.
- `persist_result?` - When `true` (which is the default) the incoming request
  will be persisted and included in the list of requests for the test in the UI.

[`suite_endpoint` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#suite_endpoint-instance_method)

[`Inferno::DSL::SuiteEndpoint` in the API
docs](/inferno-core/docs/Inferno/DSL/SuiteEndpoint.html)

### Example
In the example below, an endpoint is defined which waits for a an incoming
request with a particular bearer token and returns a FHIR Patient resource.

```ruby
class AuthorizedEndpoint < Inferno::DSL::SuiteEndpoint
  # Identify the incoming request based on a bearer token
  def test_run_identifier
    request.headers['authorization']&.delete_prefix('Bearer ')
  end

  # Return a json FHIR Patient resource
  def make_response
    response.status = 200
    response.body = FHIR::Patient.new(id: request.params[:id]).to_json
    response.format = :json
  end

  # Update the waiting test to pass when the incoming request is received.
  # This will resume the test run.
  def update_result
    results_repo.update(result.id, result: 'pass')
  end

  # Apply the 'authorized' tag to the incoming request so that it may be
  # used by later tests.
  def tags
    ['authorized']
  end
end

class AuthorizedRequestSuite < Inferno::TestSuite
  id :authorized_suite
  suite_endpoint :get, '/Patient/:id', AuthorizedEndpoint

  group do
    title 'Authorized Request Group'

    test do
      title 'Wait for authorized request'

      input :bearer_token

      run do
        wait(
          identifier: bearer_token,
          message: "Waiting to receive a request with bearer_token: #{bearer_token}" \
                    "at `#{Inferno::Application['base_url']}/custom/authorized_suite/authorized_endpoint`"
        )
      end
    end
  end
end
```
