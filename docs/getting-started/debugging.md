---
title: Debugging
nav_order: 3
parent: Getting Started
section: docs
layout: docs
---

# Debugging in Inferno

## Debug Gem

Debugging using the [debug gem](https://github.com/ruby/debug) is available if running
Inferno using a local Ruby installation. The debug gem allows users to set a breakpoint within a test's 
`run` block to debug test behavior.

To use the debug gem:
1. Add `require 'debug/open_nonstop'` and `debugger` to set a breakpoint.
2. Run your tests until the breakpoint is reached.
3. In a separate terminal window, run `bundle exec rdbg -A` to access the
  debugger console.
4. Use debug commands, which can be found [here](https://github.com/ruby/debug#debug-command-on-the-debug-console).

#### Example

We first add the `require 'debug/open_nonstop'` and `debugger` to set a breakpoint. We've added
these to lines 9 & 10 in the example test below.

```ruby
1  module InfernoTemplate
2    class PatientGroup < Inferno::TestGroup
3      ...
4      test do
5        ...
6        run do
7          fhir_read(:patient, patient_id, name: :patient)
8 
9          require 'debug/open_nonstop'
10         debugger
11 
12         assert_response_status(200)
13         assert_resource_type(:patient)
14         assert resource.id == patient_id,
15               "Requested resource with id #{patient_id}, received resource with id #{resource.id}"
16       end
17     end
18   end
19 end
```

We then run the tests until the breakpoint is reached. Then we connect to the debugger console.

```ruby
ᐅ bundle exec rdbg -A
DEBUGGER (client): Connected. PID:22112, $0:sidekiq 6.5.7  [0 of 10 busy]

[18, 27] in ~/code/inferno-template/lib/inferno_template/patient_group.rb
    18|
    19|       run do
    20|         fhir_read(:patient, patient_id, name: :patient)
    21|
    22|         require 'debug/open_nonstop'
=>  23|         debugger
    24|
    25|         assert_response_status(200)
    26|         assert_resource_type(:patient)
    27|         assert resource.id == patient_id,
```
Now you can get information about the current object
```ruby
(ruby:remote) self.id
"test_suite_template-patient_group-Test01"
(ruby:remote) self.title
"Server returns requested Patient resource from the Patient read interaction"
```
As well as the values of currently defined variables.
```ruby
(rdbg:remote) inputs
[:patient_id, :url, :credentials]
(ruby:remote) patient_id
"85"
(rdbg:remote) url
"https://inferno.healthit.gov/reference-server/r4"
```
You can also look at available methods and instance variables of a given object, like `request`
```ruby
(rdbg:remote) ls request
Inferno::Entities::Request
  created_at        created_at=  direction     direction=     headers          headers=          id        id=         index          index=          name             name=
  query_parameters  request      request_body  request_body=  request_header   request_headers   resource  response    response_body  response_body=  response_header  response_headers
  result_id         result_id=   status        status=        test_session_id  test_session_id=  to_hash   updated_at  updated_at=    url             url=             verb
  verb=
instance variables: @created_at  @direction  @headers  @id  @index  @name  @request_body  @response_body  @result_id  @status  @test_session_id  @updated_at  @url  @verb
```
And then use that as a reference to get additional information:
```ruby
(ruby:remote) request.status
200
(ruby:remote) request.response_body
"{\n  \"resourceType\": \"Patient\" ... }"
```
There are a lot more commands available than just the ones stated above.
You can always type `help` for the list of all commands, or `help [COMMAND]` for information about a specific command. 

## Interactive Console

A local Ruby installation allows you to use [pry](https://pry.github.io/) to explore and experiment with your tests using the
`inferno console` command. Pry is an alternative to the standard Interactive Ruby (IRB) shell that includes 
syntax highlighting, runtime invocation, source & documentation browsing, and more. It is a helpful tool for debugging
the environment generally, as opposed to using the debug gem to review the environment at a specific breakpoint while
running the system.

For example, I can look at the Suite class that is defined in the Inferno Template by default (`lib/inferno_template.rb`) and
set it to the variable `suite`.

```ruby
ᐅ bundle exec inferno console
[1] pry(main)> suite = InfernoTemplate::Suite
=> [#<InfernoTemplate::Suite @id="test_suite_template", @title="Inferno Test Suite Template">]
```

And then use that variable to see what groups will be run in the suite, which I see are the Capability Statement and Patient Tests.

```ruby
[2] pry(main)> suite.groups
=> [#<Inferno::Entities::TestGroup @id="test_suite_template-capability_statement", @short_id="1", @title="Capability Statement">,
 #<InfernoTemplate::PatientGroup @id="test_suite_template-patient_group", @short_id="2", @title="Patient  Tests">]
```

I can also even see which test will be run first.

```ruby
[3] pry(main)> suite.groups.first.tests
=> [#<Inferno::Entities::Test @id="test_suite_template-capability_statement-capability_statement_read", @short_id="1.01", @title="Read CapabilityStatement">]
```