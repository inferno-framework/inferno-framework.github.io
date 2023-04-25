---
title: Getting Started
nav_order: 11
section: docs
layout: docs
---
# Getting Started for Inferno Test Writers
Tests can be developed with or without a local ruby installation using docker.
However, it is highly recommended that you install ruby locally for development.
The advantages of using a local ruby installation are
* It is much faster to restart native ruby processes than to stop/rebuild/start
  docker images. This must be done every time tests change.
* It is possible to set breakpoints and access an interactive debugger inside of
  running tests, which makes test development much easier.
* The Inferno Command Line Interface can be used. Run `inferno help` for
  information.
  
### FHIR Validation Setup
Put the `package.tgz` for the IG you're writing tests for in
`lib/your_test_kit_name/igs` and update this path in
`docker-compose.background.yml`. This will ensure that the validator has access
to the resources needed to validate resources against your IG.

### Development with Ruby

#### Installation
1. Install [Docker](https://www.docker.com/get-started).
1. Install Ruby. It is highly recommended that you install ruby via a [ruby
   version
   manager](https://www.ruby-lang.org/en/documentation/installation/#managers).
1. Install [Docker](https://www.docker.com/get-started).
1. Clone the [Inferno Template
   repository](https://github.com/inferno-framework/inferno-template). You can
   either clone this repository directly, or click the green "Use this template"
   button to create your own repository based on this one.
1. Run `bundle install` to install dependencies.
1. Run `gem install inferno_core` to install inferno.
1. Run `gem install foreman` to install foreman, which will be used to run the
   Inferno web and worker processes.
1. Run `gem install rerun` to install rerun, which will be used to enable
   `watch` functionality to reload Inferno when a test has been updated.
1. Run `bundle exec inferno migrate` to set up the database.

#### Running Inferno
1. Run `bundle exec inferno services start` to start the background services. By
   default, these include nginx, redis, the FHIR validator service, and the FHIR
   validator UI. Background services can be added/removed/edited in
   `docker-compose.background.yml`.
1. Run `inferno start --watch` to start Inferno and to reload any time a file
   changes.  Remove the `watch` flag if you would prefer to manually restart
   Inferno.
1. Navigate to `http://localhost:4567` to access Inferno, where your test suite
   will be available. To access the FHIR resource validator, navigate to
   `http://localhost/validator`.
1. When you are done, run `bundle exec inferno services stop` to stop the
   background services.

#### Interactive consoles
A local ruby installation also allows you to use [pry](https://pry.github.io/),
a powerful interactive console, to explore and experiment with your tests with
`inferno console`:
```ruby
ᐅ bundle exec inferno console
[1] pry(main)> suite = InfernoTemplate::Suite
=> InfernoTemplate::Suite
[2] pry(main)> suite.groups
=> [#<Inferno::Entities::TestGroup @id="test_suite_template-capability_statement", @short_id="1", @title="Capability Statement">,
 #<InfernoTemplate::PatientGroup @id="test_suite_template-patient_group", @short_id="2", @title="Patient  Tests">]
[3] pry(main)> suite.groups.first.tests
=> [#<Inferno::Entities::Test @id="test_suite_template-capability_statement-capability_statement_read", @short_id="1.01", @title="Read CapabilityStatement">]
```

It is also possible to set a breakpoint using the [debug
gem](https://github.com/ruby/debug) within a test's `run` block to debug test
behavior:
- Add `require 'debug/open_nonstop'` and `debugger` to set the breakpoint.
- Run your tests until the breakpoint is reached.
- In a separate terminal window, run `bundle exec rdbg -A` to access the
  interactive console.

```ruby
module InfernoTemplate
  class PatientGroup < Inferno::TestGroup
    ...
    test do
      ...
      run do
        fhir_read(:patient, patient_id, name: :patient)

        require 'debug/open_nonstop'
        debugger

        assert_response_status(200)
        assert_resource_type(:patient)
        assert resource.id == patient_id,
               "Requested resource with id #{patient_id}, received resource with id #{resource.id}"
      end
    end
  end
end
```

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
(ruby:remote) self.id
"test_suite_template-patient_group-Test01"
(ruby:remote) self.title
"Server returns requested Patient resource from the Patient read interaction"
(rdbg:remote) inputs
[:patient_id, :url, :credentials]
(ruby:remote) patient_id
"85"
(rdbg:remote) url
"https://inferno.healthit.gov/reference-server/r4"
(rdbg:remote) ls request    # outline command
Inferno::Entities::Request#methods:
  created_at        created_at=  direction     direction=     headers          headers=          id        id=         index          index=          name             name=
  query_parameters  request      request_body  request_body=  request_header   request_headers   resource  response    response_body  response_body=  response_header  response_headers
  result_id         result_id=   status        status=        test_session_id  test_session_id=  to_hash   updated_at  updated_at=    url             url=             verb
  verb=
instance variables: @created_at  @direction  @headers  @id  @index  @name  @request_body  @response_body  @result_id  @status  @test_session_id  @updated_at  @url  @verb
(ruby:remote) request.status
200
(ruby:remote) request.response_body
"{\n  \"resourceType\": \"Patient\" ... }"
(rdbg:remote) ?    # help command

### Control flow

* `s[tep]`
  * Step in. Resume the program until next breakable point.
...
```

### Development with Docker Only

#### Installation
1. Install [Docker](https://www.docker.com/get-started).
1. Clone the [Inferno Template
   repository](https://github.com/inferno-framework/inferno-template). You can
   either clone this repository directly, or click the green "Use this template"
   button to create your own repository based on this one.
1. Run `./setup.sh` in the template repository to retrieve the necessary docker
   images and create a database.

#### Running Inferno
After installation, run the `./run.sh` script to start Inferno.
- Navigate to [localhost](http://localhost) to access Inferno and run test
  suites.
- Navigate to [localhost/validator](http://localhost/validator) to access a
  standalone validator that can be used to validate individual FHIR resources.
   

### Next Steps
Now that Inferno is running, you could learn about [the file/directory
organization](/inferno-core/repo-layout-and-organization.html) or just start
[writing tests](/inferno-core/writing-tests).
