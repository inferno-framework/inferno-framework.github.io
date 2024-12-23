---
title: Serving HTTP Requests
nav_order: 3
parent: Advanced Features
layout: docs
section: docs
---
# Serving HTTP Requests
Some testing scenarios require that Inferno responds to incoming HTTP requests.
For these cases, a suite can define custom routes to be served by Inferno.
For example, authorization workflows based on asymmetric
client credentials require that public keys are served at an accessible
location, so Inferno needs to be able to serve these keys in order to support
these workflows.
  
To prevent conflicts between routes defined by different test suites,
suite-defined routes are served at
`INFERNO_BASE/custom/SUITE_ID/CUSTOM_ROUTE_PATH`.

## Defining Custom Routes
Custom routes are defined using the
[`route`](/inferno-core/docs/Inferno/DSL/Runnable.html#route-instance_method)
method.

```ruby
class MyTestSuite < Inferno::TestSuite
  route(:get, 'my_custom_route', my_route_handler)
end
```

`route` takes three arguments, a symbol for the HTTP verb served by the route
(`:get`, `:post`, etc., or `:all`), a String for the route path, and a route
handler. The following section has more information about route handlers.

[`route` in the API
docs](/inferno-core/docs/Inferno/DSL/Runnable.html#route-instance_method)

## Route Handlers
[Rack](https://github.com/rack/rack) is a standard interface for handling HTTP
requests in Ruby. Route handlers must be a Rack-compatible object, which could
be something as simple as a Lambda, or an entire web application built in
something like [Sinatra](https://sinatrarb.com/).

The requirements for a Rack-compatible route handler are as follows:

* It must respond to the `call` method which takes one argument, [the
  environment](https://github.com/rack/rack/blob/main/SPEC.rdoc#the-environment-).
* It must return a three element array consisting of:
  * The HTTP status code (integer)
  * The response headers (Hash)
  * The response body (Array of Strings)

Here are a few examples:
```ruby
class MyTestSuite < Inferno::TestSuite
  id :my_test_suite
  
  my_html = File.read(File.join(__dir__, 'my_html.html'))
  my_html_route_handler = proc { [200, { 'Content-Type' => 'text/html' }, [my_html]] }
  
  # Serve an html page at INFERNO_PATH/custom/my_test_suite/my_html_page
  route(:get, '/my_html_page', my_html_route_handler)
  
  my_jwks = File.read(File.join(__dir__, 'my_jwks.json'))
  my_jwks_route_handler = proc { [200, { 'Content-Type' => 'application/json' }, [my_jwks]] }
  
  # Serve a JSON file at INFERNO_PATH/custom/my_test_suite/.well-known/jwks.json
  route(:get, '/.well-known/jwks.json', my_jwks_route_handler)
end
```
