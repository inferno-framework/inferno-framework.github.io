---
title: Making Requests
nav_order: 4
parent: Writing Tests
layout: docs
section: docs
---
{:toc-skip: .h4 data-toc-skip=""}

# Making Requests
Inferno provides support for making FHIR requests as well as generic HTTP requests.

## Accessing Requests and Responses
After making a FHIR or HTTP request, information about it is made available via several
methods:
- `request` - returns a
  [`Request`](/inferno-core/docs/Inferno/Entities/Request.html) object which
  contains all of the information about the request and the response.
- `response` - returns a Hash containing the `status`, `headers`, and `body` of
  the response.
- `resource` - returns the response body as a FHIR model.

```ruby
test do
  run do
    fhir_read(:patient, '123')

    request  # A `Request` object containing the request and response
    response # A `Hash` containing the response information
    resource # A FHIR model built from the response body
  end
end
```

When making [assertions](/inferno-core/docs/Inferno/DSL/Assertions.html) against
a response or resource, the assertions that are designed to be used with
responses and resources will automatically use the response/resource from the
last request. It is therefore unnecessary to pass the response/resource in to the assertion
unless you want to make assertions against a different response/resource.

```ruby
test do
  run do
    fhir_read(:patient, '123')

    # Using the values from the fhir_read request automatically
    assert_response_status(200)
    assert_resource_type(:patient)
    assert_valid_resource

    ...

    # Specifying the request & resource explicitly
    assert_response_status(200, request: some_other_request)
    assert_resource_type(:patient, resource: some_other_resource)
    assert_valid_resource(resource: some_other_resource)
  end
end
```

## Reusing Requests
If you want to reuse requests from earlier tests instead of reissuing them,
you can give the initial request a name, or tags.

### Named Requests
{:toc-skip}

Naming a request is an easy way to reuse a single request. The test where the
request is made declares that it makes a request with a particular name, and
then other tests which require access to this request declare that they use it.

```ruby
group do
  test do
    # Declare that this test makes a particular request
    makes_request :patient_read

    run do
      fhir_read(:patient, '123', name: :patient_read) # include the name
    end
  end

  test do
    # Declare that this test uses the named request ":patient_read". The test runner
    # will automatically load this request and make it available within the test.
    uses_request :patient_read

    run do
      # These will all be populated with the request from the first test
      request
      response
      resource
    end
  end
end
```

### Tagged Requests
{:toc-skip}

Tagging requests provides a way to reuse multiple requests, as well as load
dynamic collections of requests. The `tags` argument can be used with any FHIR
or HTTP request to assign an array of arbitrary tags to a request.
`load_tagged_requests` will load requests which contain all of the specified
tags. Individual tests may be run multiple times during a single test session,
but only requestes from the most recent run of any test will be loaded when
using `load_tagged_requests`.

```ruby
group do
  test do
    run do
      fhir_search(:patient, params: { _id: 'abc' }, tags: ['Patient', 'Patient?_id', 'search'])
      fhir_search(:patient, params: { _id: 'def'}, tags: ['Patient', 'Patient?_id', 'search'])

      fhir_read(:condition, 'xyz', tags: ['Condition', 'read'])
      fhir_search(:condition, params: { patient: '123' }, tags: ['Condition', 'Condition?patient', 'search'])
      fhir_search(:condition, params: { category: 'problem-list-item' }, tags: ['Condition', 'Condition?category', 'search'])
      fhir_search(:condition, params: { code: '165002' }, tags: ['Condition', 'Condition?code', 'search'])
    end
  end

  test do
    run do
      load_tagged_requests('Patient?_id') # Load all requests with "Patient?_id" tag_
      load_tagged_requests('Condition', 'search') # load all requests with both "Condition" and "search" tags

      # This is populated with all of the loaded requests
      requests
    end
  end
end
```

## FHIR Requests

### FHIR Clients
{:toc-skip}

Before making a FHIR request, a client needs to be created. Clients are passed
down from a `TestSuite` or `TestGroup` to all of their descendants, so it isn't
necessary for each `Test` to define its own client. When defining a client, you
MUST set the base server url, and you MAY set a bearer token and additional
custom headers.

```ruby
group do
  fhir_client do
    url 'https://example.com/fhir'   # required
    headers 'X-Custom-Header' => 'def' # optional
  end

  test do
    run do
      # FHIR requests will automatically use the client declared above
    end
  end
end
```

If you need direct access to the FHIR client in a test, it is available via
`fhir_client`. The client is reinstantiated in each test, so changes made to a
client within a test do not carry over into other tests.

```ruby
test do
  run do
    fhir_client # this returns the FHIR client
  end
end
```
[methods for defining FHIR clients in the API docs](/inferno-core/docs/Inferno/DSL/FHIRClientBuilder.html)

### Available FHIR Request Methods
{:toc-skip}

The following methods are currently available for making FHIR requests:
- `fhir_create`
- `fhir_delete`
- `fhir_get_capability_statement`
- `fhir_history`
- `fhir_operation`
- `fhir_patch`
- `fhir_read`
- `fhir_search`
- `fhir_transaction`
- `fhir_update`
- `fhir_vread`
- `fetch_all_bundled_resources`

For more details on these methods, see the [FHIR Client API
documentation](/inferno-core/docs/Inferno/DSL/FHIRClient.html). If you need to
make other types of FHIR requests, [contact the Inferno
team](/about/who.html) so we can prioritize adding them.

Here are some examples of how to use the above methods:

```ruby
test do
  # Create a resource on a server
  new_patient = FHIR::Patient.new(name: [{ given: ['Jane'], family: 'Doe'}])
  fhir_create(new_patient)

  # Delete a resource on a server
  fhir_delete(:patient, 'resource_to_delete_id_1')
  fhir_delete('Patient', 'resource_to_delete_id_2')

  # Fetch a server's CapabilityStatement
  fhir_get_capability_statement

  # Perform a FHIR Operation
  parameters = FHIR::Parameters.new(
    parameter: [
      {
        name: 'code',
        valueCode: '85354-9'
      },
      {
        name: 'system'
        valueUri: 'http://loinc.org'
      }
    ]
  )
  fhir_operation("/CodeSystem/$lookup", body: parameters)

  # Read a FHIR resource
  fhir_read(:patient, 'resource_to_read_id')
  fhir_read('Patient', 'resource_to_read_id')

  # Perform a FHIR search w/GET
  fhir_search(:patient, params: { family: 'Smith' })
  fhir_search('Patient', params: { family: 'Smith' })

  # Perform a FHIR search w/POST
  fhir_search(:patient, params: { family: 'Smith' }, search_method: :post)
  fhir_search('Patient', params: { family: 'Smith' }, search_method: :post)

  # Fetch all resources from a paginated bundle resource from the last search request.
  # It will add an info message to the runnable if the bundle contains a resource type other than Patient.
  fetch_all_bundled_resources(resource_type: 'Patient')

  # Fetch all resources with options
  # - Uses a specific bundle instead of defaulting to the bundle resource from the last search request
  # - Follows up to 10 pagination links (default is 20)
  # - Specifies additional resource types that could be in the bundle
  # It will add an info message to the runnable if the bundle contains a resource type other than
  # Composition, Patient, or ServiceRequest.
  fetch_all_bundled_resources(
    resource_type: 'Composition',
    bundle: some_bundle,
    max_pages: 10,
    additional_resource_types: ['Patient', 'ServiceRequest']
  )

  # Perform a FHIR transaction
  transaction_bundle = FHIR::Bundle.new(
    type: 'transaction',
    entry: [
      # a list of transaction entries
    ]
  )
  fhir_transaction(transaction_bundle)
end
```

### Making Requests to Multiple Servers
{:toc-skip}

If you need to make requests to multiple FHIR servers, this can be accomplished
by naming each `fhir_client`.

```ruby
group do
  fhir_client :client_a do
    url :url_a
  end

  fhir_client :client_b do
    url :url_b
  end

  test do
    run do
      fhir_read(:patient, '123', client: :client_a)

      fhir_read(:patient, '456', client: :client_b)
    end
  end
end
```

### AuthInfo for FHIR Requests
Authorization for FHIR requests can be provided with an [`AuthInfo`
input](/docs/writing-tests/test-inputs-outputs.html#authinfo). When using
`AuthInfo`, the access token will automatically be refreshed when needed.

```ruby
input :url
input :my_auth_info,
      type: :auth_info

fhir_client do
  url :url
  auth_info :my_auth_info
end
```

Usually, a SMART App Launch will be performed to obtain this authorization. In
these cases, [tests from the SMART App Launch Test Kit can be
reused](https://github.com/inferno-framework/smart-app-launch-test-kit#importing-tests)
to perform the authorization workflow.

### OAuth Credentials
{:toc-skip}

**NOTE:** It is recommended that [`AuthInfo`](#authinfo-for-fhir-requests) be
used rather than OAuth Credentials.

When making requests to FHIR servers using OAuth2-based authorization (such as the SMART App
Launch workflow), OAuth credentials support an access token and,
optionally, a refresh token and the information needed to perform a
token refresh (refresh token, token endpoint, client ID, client secret). If all
of this information is available, the FHIR client will automatically refresh the
access token if it will expire in under a minute. If no information on the
access token duration is available, the token will be refreshed prior to each
FHIR request.

```ruby
group do
  input :credentials, type: :oauth_credentials

  fhir_client do
    url 'https://example.com/fhir'
    oauth_credentials :credentials
  end

  test do
    run do
      sleep 3600

      # The access token will automatically refresh if it has expired
      fhir_read(:patient, '123')
    end
  end
end
```

## HTTP Requests

### HTTP Clients
{:toc-skip}

It is not necessary to create a HTTP client in order to make HTTP requests, but
it may be helpful if you need to make multiple requests to the same server. If
an HTTP client is available, then the HTTP request methods only need
the relative path from the client's url rather than an
absolute url. The syntax for doing so is the same as that for [FHIR
clients](#fhir-clients), except the method is called `http_client` rather than
`fhir_client`.

```ruby
group do
  http_client do
    url 'https://example.com'
    bearer_token 'abc'
    headers 'X-Custom-Header' => 'def'
  end

  test do
    run do
      get '/path'  # Makes a request to `https://example.com/path`
    end
  end
end

```

### Available HTTP Request Methods
{:toc-skip}

The following methods are currently available for making HTTP requests:
- `get`
- `post`
- `delete`
- `stream` - used to stream the response from a GET request

For more details on these methods, see the [HTTP Client API
documentation](/inferno-core/docs/Inferno/DSL/HTTPClient.html). If you need to
make other types of HTTP requests, [contact the Inferno
team](/about/who.html) so we can prioritize adding them.
